# ============================================
# Flask API for Brent Oil Analysis Dashboard
# ============================================

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Data paths
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'outputs')

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Global data variables
price_data = None
events_data = None
change_points = None

def load_data():
    """Load all data into memory"""
    global price_data, events_data, change_points
    
    # Load price data
    price_path = os.path.join(DATA_DIR, 'BrentOilPrices.csv')
    if os.path.exists(price_path):
        price_data = pd.read_csv(price_path)
        price_data['Date'] = pd.to_datetime(price_data['Date'], format='mixed', dayfirst=True)
        price_data = price_data.sort_values('Date').reset_index(drop=True)
        print(f"Loaded {len(price_data)} price records")
    else:
        print("Price data not found. Creating sample data...")
        create_sample_data()
        price_data = pd.read_csv(price_path)
        price_data['Date'] = pd.to_datetime(price_data['Date'], format='mixed', dayfirst=True)
        price_data = price_data.sort_values('Date').reset_index(drop=True)
    
    # Load events data
    events_path = os.path.join(DATA_DIR, 'events.csv')
    if os.path.exists(events_path):
        events_data = pd.read_csv(events_path)
        events_data['date'] = pd.to_datetime(events_data['date'])
        print(f"Loaded {len(events_data)} events")
    else:
        print("Events data not found. Creating sample events...")
        create_sample_events()
        events_data = pd.read_csv(events_path)
        events_data['date'] = pd.to_datetime(events_data['date'])
    
    # Load change point results
    cp_path = os.path.join(OUTPUT_DIR, 'single_change_point.csv')
    if os.path.exists(cp_path):
        change_points = pd.read_csv(cp_path)
        change_points['change_date'] = pd.to_datetime(change_points['change_date'])
        print(f"Loaded {len(change_points)} change points")
    else:
        print("Change point data not found. Using default values.")
        change_points = pd.DataFrame()

def create_sample_data():
    """Create sample price data if file doesn't exist"""
    dates = pd.date_range(start='1987-05-20', end='2022-09-30', freq='D')
    np.random.seed(42)
    
    trend = np.linspace(20, 80, len(dates))
    noise = np.random.normal(0, 5, len(dates))
    shocks = np.zeros(len(dates))
    shocks[8000:8100] = 20
    shocks[10000:10500] = -30
    shocks[11500:12000] = -40
    
    prices = trend + noise + shocks
    prices = np.maximum(prices, 0)
    
    df = pd.DataFrame({
        'Date': dates.strftime('%d-%b-%y'),
        'Price': prices
    })
    df.to_csv(os.path.join(DATA_DIR, 'BrentOilPrices.csv'), index=False)

def create_sample_events():
    """Create sample events data if file doesn't exist"""
    events = [
        ('1990-08-02', 'Gulf War Invasion', 'Conflict', 'Iraq invades Kuwait', 'High'),
        ('1991-01-17', 'Desert Storm', 'Conflict', 'US-led coalition attacks Iraq', 'High'),
        ('2001-09-11', '9/11 Attacks', 'Conflict', 'Terror attacks on US', 'High'),
        ('2003-03-20', 'Iraq War', 'Conflict', 'US invasion of Iraq', 'High'),
        ('2008-09-15', 'Global Financial Crisis', 'Economic', 'Lehman Brothers collapse', 'High'),
        ('2010-12-17', 'Arab Spring', 'Political', 'Middle East uprisings', 'Medium'),
        ('2011-02-15', 'Libyan Civil War', 'Conflict', 'Libyan revolution begins', 'High'),
        ('2014-11-27', 'OPEC Meeting', 'Market', 'OPEC decides to maintain production levels', 'High'),
        ('2016-11-30', 'OPEC Production Cut', 'Market', 'OPEC+ agrees to production cuts', 'High'),
        ('2020-03-11', 'COVID-19 Pandemic', 'Global Crisis', 'WHO declares COVID-19 pandemic', 'High'),
        ('2020-04-20', 'Negative Oil Prices', 'Market', 'WTI crude oil futures turn negative', 'High'),
        ('2022-02-24', 'Russia-Ukraine War', 'Conflict', 'Russia invades Ukraine', 'High')
    ]
    
    df = pd.DataFrame(events, columns=['date', 'event_name', 'category', 'description', 'impact_level'])
    df.to_csv(os.path.join(DATA_DIR, 'events.csv'), index=False)

# ============================================
# API Routes
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/price_data', methods=['GET'])
def get_price_data():
    """Get price data with optional date range filtering"""
    try:
        # Get query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        df = price_data.copy()
        
        # Apply date filters
        if start_date:
            start = pd.to_datetime(start_date)
            df = df[df['Date'] >= start]
        if end_date:
            end = pd.to_datetime(end_date)
            df = df[df['Date'] <= end]
        
        # Convert to JSON serializable format
        result = df.to_dict(orient='records')
        for record in result:
            record['Date'] = record['Date'].strftime('%Y-%m-%d')
        
        return jsonify({
            'data': result,
            'count': len(result),
            'start_date': df['Date'].min().strftime('%Y-%m-%d') if not df.empty else None,
            'end_date': df['Date'].max().strftime('%Y-%m-%d') if not df.empty else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get events data"""
    try:
        df = events_data.copy()
        result = df.to_dict(orient='records')
        for record in result:
            record['date'] = record['date'].strftime('%Y-%m-%d')
        
        return jsonify({
            'data': result,
            'count': len(result),
            'categories': df['category'].unique().tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/change_points', methods=['GET'])
def get_change_points():
    """Get change point detection results"""
    try:
        if change_points.empty:
            return jsonify({'data': [], 'message': 'No change points found'})
        
        df = change_points.copy()
        result = df.to_dict(orient='records')
        for record in result:
            if 'change_date' in record:
                record['change_date'] = record['change_date'].strftime('%Y-%m-%d')
        
        return jsonify({
            'data': result,
            'count': len(result)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get summary statistics"""
    try:
        df = price_data.copy()
        
        # Calculate basic statistics
        stats = {
            'total_records': len(df),
            'start_date': df['Date'].min().strftime('%Y-%m-%d'),
            'end_date': df['Date'].max().strftime('%Y-%m-%d'),
            'mean_price': float(df['Price'].mean()),
            'median_price': float(df['Price'].median()),
            'min_price': float(df['Price'].min()),
            'max_price': float(df['Price'].max()),
            'std_price': float(df['Price'].std()),
            'price_range': float(df['Price'].max() - df['Price'].min())
        }
        
        # Calculate returns statistics
        df['returns'] = df['Price'].pct_change()
        df_returns = df.dropna()
        
        stats.update({
            'mean_return': float(df_returns['returns'].mean()),
            'std_return': float(df_returns['returns'].std()),
            'max_return': float(df_returns['returns'].max()),
            'min_return': float(df_returns['returns'].min())
        })
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event_impact/<event_id>', methods=['GET'])
def get_event_impact(event_id):
    """Get impact analysis for a specific event"""
    try:
        # Find the event
        event = events_data[events_data['event_name'] == event_id]
        if event.empty:
            return jsonify({'error': 'Event not found'}), 404
        
        event_date = event.iloc[0]['date']
        
        # Get price data around the event (30 days before and after)
        start_window = event_date - timedelta(days=30)
        end_window = event_date + timedelta(days=30)
        
        window_data = price_data[
            (price_data['Date'] >= start_window) & 
            (price_data['Date'] <= end_window)
        ].copy()
        
        if window_data.empty:
            return jsonify({'error': 'No price data available for this period'}), 404
        
        # Calculate impact metrics
        pre_event = window_data[window_data['Date'] < event_date]
        post_event = window_data[window_data['Date'] >= event_date]
        
        impact = {
            'event_name': event.iloc[0]['event_name'],
            'event_date': event_date.strftime('%Y-%m-%d'),
            'category': event.iloc[0]['category'],
            'pre_event_mean': float(pre_event['Price'].mean()) if not pre_event.empty else None,
            'post_event_mean': float(post_event['Price'].mean()) if not post_event.empty else None,
            'price_change': float(post_event['Price'].mean() - pre_event['Price'].mean()) if not pre_event.empty and not post_event.empty else None,
            'percent_change': float(((post_event['Price'].mean() - pre_event['Price'].mean()) / pre_event['Price'].mean()) * 100) if not pre_event.empty and not post_event.empty else None,
            'pre_event_volatility': float(pre_event['Price'].std()) if not pre_event.empty else None,
            'post_event_volatility': float(post_event['Price'].std()) if not pre_event.empty else None,
            'window_data': window_data.to_dict(orient='records')
        }
        
        # Convert dates in window data
        for record in impact['window_data']:
            record['Date'] = record['Date'].strftime('%Y-%m-%d')
        
        return jsonify(impact)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/price_summary', methods=['GET'])
def get_price_summary():
    """Get aggregated price summary by year/month"""
    try:
        df = price_data.copy()
        
        # Yearly summary
        df['year'] = df['Date'].dt.year
        df['month'] = df['Date'].dt.month
        
        yearly = df.groupby('year').agg({
            'Price': ['mean', 'min', 'max', 'std']
        }).reset_index()
        yearly.columns = ['year', 'mean', 'min', 'max', 'std']
        yearly = yearly.fillna(0)
        
        # Monthly summary (last 5 years)
        recent = df[df['Date'] >= (df['Date'].max() - timedelta(days=5*365))]
        monthly = recent.groupby([recent['Date'].dt.year, recent['Date'].dt.month]).agg({
            'Price': 'mean'
        }).reset_index()
        monthly.columns = ['year', 'month', 'mean_price']
        
        return jsonify({
            'yearly_summary': yearly.to_dict(orient='records'),
            'monthly_summary': monthly.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/correlation', methods=['GET'])
def get_event_correlation():
    """Get correlation between events and price changes"""
    try:
        correlations = []
        
        for _, event in events_data.iterrows():
            event_date = event['date']
            
            # Get prices 10 days before and after
            pre_event = price_data[
                (price_data['Date'] >= event_date - timedelta(days=10)) & 
                (price_data['Date'] < event_date)
            ]
            post_event = price_data[
                (price_data['Date'] >= event_date) & 
                (price_data['Date'] <= event_date + timedelta(days=10))
            ]
            
            if not pre_event.empty and not post_event.empty:
                pre_mean = pre_event['Price'].mean()
                post_mean = post_event['Price'].mean()
                change_pct = ((post_mean - pre_mean) / pre_mean) * 100
                
                correlations.append({
                    'event_name': event['event_name'],
                    'event_date': event_date.strftime('%Y-%m-%d'),
                    'category': event['category'],
                    'price_change_percent': float(change_pct),
                    'pre_price_mean': float(pre_mean),
                    'post_price_mean': float(post_mean),
                    'impact_direction': 'positive' if change_pct > 0 else 'negative' if change_pct < 0 else 'neutral'
                })
        
        return jsonify({
            'correlations': correlations,
            'count': len(correlations)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# Main
# ============================================

if __name__ == '__main__':
    # Load data on startup
    load_data()
    
    print("\n" + "="*50)
    print("Brent Oil Analysis API Server")
    print("="*50)
    print(f"Price records: {len(price_data) if price_data is not None else 0}")
    print(f"Events: {len(events_data) if events_data is not None else 0}")
    print(f"Change points: {len(change_points) if change_points is not None else 0}")
    print("="*50)
    print("Server running at http://localhost:5000")
    print("API endpoints:")
    print("  GET /api/health")
    print("  GET /api/price_data")
    print("  GET /api/events")
    print("  GET /api/change_points")
    print("  GET /api/statistics")
    print("  GET /api/price_summary")
    print("  GET /api/correlation")
    print("  GET /api/event_impact/<event_id>")
    print("="*50)
    
    app.run(debug=True, port=5000, host='0.0.0.0')