import React from 'react';
import './StatisticsPanel.css';

const StatisticsPanel = ({ statistics }) => {
  if (!statistics) {
    return <div className="statistics-panel">Loading statistics...</div>;
  }

  const stats = [
    { label: 'Total Records', value: statistics.total_records?.toLocaleString() || '-' },
    { label: 'Date Range', value: `${statistics.start_date || '-'} to ${statistics.end_date || '-'}` },
    { label: 'Mean Price', value: `$${statistics.mean_price?.toFixed(2) || '-'}` },
    { label: 'Median Price', value: `$${statistics.median_price?.toFixed(2) || '-'}` },
    { label: 'Min Price', value: `$${statistics.min_price?.toFixed(2) || '-'}` },
    { label: 'Max Price', value: `$${statistics.max_price?.toFixed(2) || '-'}` },
    { label: 'Price Std Dev', value: `$${statistics.std_price?.toFixed(2) || '-'}` },
    { label: 'Price Range', value: `$${statistics.price_range?.toFixed(2) || '-'}` },
    { label: 'Mean Return', value: `${(statistics.mean_return * 100)?.toFixed(2) || '-'}%` },
    { label: 'Return Std Dev', value: `${(statistics.std_return * 100)?.toFixed(2) || '-'}%` },
  ];

  return (
    <div className="statistics-panel">
      <h4>📊 Summary Statistics</h4>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-item">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPanel;