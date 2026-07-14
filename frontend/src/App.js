import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { fetchPriceData, fetchEvents, fetchStatistics } from './services/api';

function App() {
  const [priceData, setPriceData] = useState([]);
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [priceRes, eventsRes, statsRes] = await Promise.all([
        fetchPriceData(),
        fetchEvents(),
        fetchStatistics()
      ]);
      
      setPriceData(priceRes.data || []);
      setEvents(eventsRes.data || []);
      setStatistics(statsRes);
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
        <p>Loading Brent Oil Price Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🛢️ Brent Oil Price Analysis Dashboard</h1>
        <p>Change Point Detection & Event Association</p>
      </header>
      <main>
        <Dashboard 
          priceData={priceData} 
          events={events} 
          statistics={statistics}
          onRefresh={loadData}
        />
      </main>
      <footer className="app-footer">
        <p>© 2026 Birhan Energies - Data-Driven Oil Market Analysis</p>
      </footer>
    </div>
  );
}

export default App;