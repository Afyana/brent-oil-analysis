# Brent Oil Price Analysis - Change Point Detection

## 📊 Project Overview

This project analyzes Brent oil prices from 1987 to 2022, identifying structural breaks and associating them with major geopolitical and economic events.

## 🎯 Objectives

- Identify key events that significantly impacted Brent oil prices
- Quantify event impacts using Bayesian change point detection
- Provide data-driven insights for investors, policymakers, and energy companies

## 🛠️ Technologies Used

### Backend
- **Python 3.12**
- **Flask** - REST API
- **PyMC** - Bayesian modeling
- **Pandas/NumPy** - Data processing
- **Matplotlib/Seaborn** - Visualization

### Frontend
- **React** - UI framework
- **Recharts** - Data visualization
- **Axios** - API calls

## 📁 Project Structure
brent-oil-analysis/
├── backend/
│ ├── app.py # Flask API
│ ├── data/ # Data files
│ └── outputs/ # Analysis results
├── frontend/
│ ├── src/ # React source code
│ └── public/ # Static files
├── notebooks/
│ └── 01_analysis.ipynb # Jupyter notebook
├── data/
│ └── events.csv # Event data
└── outputs/ # Analysis outputs                                                 ## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                                                                   Frontend Setup
cd frontend
npm install
npm start                                                                       Key Results
Detected multiple structural breaks in Brent oil prices

Associated changes with major events:

2008 Financial Crisis

2014 Oil Price Crash

2020 COVID-19 Pandemic

2022 Russia-Ukraine War

📝 API Endpoints
Endpoint	Method	Description
/api/health	GET	Health check
/api/price_data	GET	Get price data
/api/events	GET	Get events data
/api/statistics	GET	Get statistics
/api/change_points	GET	Get change points
📈 Dashboard Features
Interactive price chart with event markers

Filter by date range

Event highlighting

Statistical summary

Change point detection results 
