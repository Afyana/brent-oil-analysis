import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange, onRefresh }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onFilterChange({ startDate, endDate });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onFilterChange({ startDate: '', endDate: '' });
  };

  return (
    <div className="filters-container">
      <h4>🔧 Filters</h4>
      <div className="filters-row">
        <div className="filter-group">
          <label>Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-actions">
        <button onClick={handleApply} className="btn-primary">Apply Filters</button>
        <button onClick={handleReset} className="btn-secondary">Reset</button>
        <button onClick={onRefresh} className="btn-refresh">🔄 Refresh Data</button>
      </div>
    </div>
  );
};

export default Filters;