import React, { useState, useEffect } from 'react';
import PriceChart from './PriceChart';
import EventList from './EventList';
import StatisticsPanel from './StatisticsPanel';
import ChangePointDisplay from './ChangePointDisplay';
import Filters from './Filters';
import './Dashboard.css';

const Dashboard = ({ priceData, events, statistics, onRefresh }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    setFilteredData(priceData);
  }, [priceData]);

  const handleFilterChange = ({ startDate, endDate }) => {
    setDateRange({ start: startDate, end: endDate });
    
    let filtered = priceData;
    if (startDate) {
      filtered = filtered.filter(d => new Date(d.Date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(d => new Date(d.Date) <= new Date(endDate));
    }
    setFilteredData(filtered);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="statistics-section">
          <StatisticsPanel statistics={statistics} />
        </div>
        <div className="filters-section">
          <Filters onFilterChange={handleFilterChange} onRefresh={onRefresh} />
        </div>
      </div>

      <div className="dashboard-main">
        <div className="chart-section">
          <PriceChart 
            data={filteredData} 
            events={events}
            selectedEvent={selectedEvent}
          />
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="events-section">
          <EventList 
            events={events} 
            onEventSelect={handleEventSelect}
            selectedEvent={selectedEvent}
          />
        </div>
        <div className="change-point-section">
          <ChangePointDisplay />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;