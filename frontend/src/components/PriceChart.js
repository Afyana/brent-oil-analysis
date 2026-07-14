import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import './PriceChart.css';

const PriceChart = ({ data, events, selectedEvent }) => {
  // Format data for recharts
  const chartData = data.map(d => ({
    date: d.Date,
    price: d.Price
  }));

  // Get event dates for reference lines
  const eventLines = events.map(event => ({
    date: event.date,
    name: event.event_name,
    category: event.category,
    isSelected: selectedEvent && selectedEvent.event_name === event.event_name
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-price">
            Price: ${payload[0].value?.toFixed(2) || 'N/A'}
          </p>
        </div>
      );
    }
    return null;
  };

  const getEventColor = (category) => {
    const colors = {
      'Conflict': '#ff6b6b',
      'Economic': '#ffa94d',
      'Political': '#cc9eff',
      'Global Crisis': '#ff4757',
      'Market': '#2ed573',
      'Natural Disaster': '#ff7f50'
    };
    return colors[category] || '#999';
  };

  return (
    <div className="price-chart-container">
      <h3>Brent Oil Price History</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Event reference lines */}
            {eventLines.map((event, idx) => (
              <ReferenceLine
                key={idx}
                x={event.date}
                stroke={event.isSelected ? '#ff0000' : getEventColor(event.category)}
                strokeDasharray={event.isSelected ? '3 3' : '5 5'}
                strokeWidth={event.isSelected ? 3 : 1.5}
                label={{
                  value: event.name,
                  position: 'top',
                  fill: event.isSelected ? '#ff0000' : getEventColor(event.category),
                  fontSize: 10
                }}
              />
            ))}
            
            {/* Price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2c3e50"
              strokeWidth={2}
              dot={false}
              name="Brent Oil Price"
            />
            
            {/* Area fill under the line */}
            <Area
              type="monotone"
              dataKey="price"
              fill="#2c3e50"
              fillOpacity={0.1}
              stroke="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ background: '#2c3e50' }}></span>
          Price
        </span>
        {Object.entries({
          'Conflict': '#ff6b6b',
          'Economic': '#ffa94d',
          'Political': '#cc9eff',
          'Global Crisis': '#ff4757',
          'Market': '#2ed573',
          'Natural Disaster': '#ff7f50'
        }).map(([category, color]) => (
          <span key={category} className="legend-item">
            <span className="legend-color" style={{ background: color }}></span>
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PriceChart;