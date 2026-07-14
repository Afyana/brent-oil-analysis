import React, { useState } from 'react';
import './EventList.css';

const EventList = ({ events, onEventSelect, selectedEvent }) => {
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(events.map(e => e.category))];

  const filteredEvents = filterCategory === 'All' 
    ? events 
    : events.filter(e => e.category === filterCategory);

  const getCategoryColor = (category) => {
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
    <div className="event-list">
      <div className="event-list-header">
        <h4>📅 Key Events</h4>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="event-items">
        {filteredEvents.map((event, idx) => (
          <div 
            key={idx} 
            className={`event-item ${selectedEvent && selectedEvent.event_name === event.event_name ? 'selected' : ''}`}
            onClick={() => onEventSelect(event)}
          >
            <div className="event-indicator" style={{ background: getCategoryColor(event.category) }} />
            <div className="event-info">
              <div className="event-name">{event.event_name}</div>
              <div className="event-meta">
                <span className="event-date">{event.date}</span>
                <span className="event-category" style={{ color: getCategoryColor(event.category) }}>
                  {event.category}
                </span>
                <span className="event-impact">{event.impact_level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;