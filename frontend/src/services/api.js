import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Fetch price data
export const fetchPriceData = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  
  const response = await api.get('/price_data', { params });
  return response.data;
};

// Fetch events
export const fetchEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// Fetch change points
export const fetchChangePoints = async () => {
  const response = await api.get('/change_points');
  return response.data;
};

// Fetch statistics
export const fetchStatistics = async () => {
  const response = await api.get('/statistics');
  return response.data;
};

// Fetch price summary
export const fetchPriceSummary = async () => {
  const response = await api.get('/price_summary');
  return response.data;
};

// Fetch event correlation
export const fetchEventCorrelation = async () => {
  const response = await api.get('/correlation');
  return response.data;
};

// Fetch event impact
export const fetchEventImpact = async (eventName) => {
  const response = await api.get(`/event_impact/${encodeURIComponent(eventName)}`);
  return response.data;
};

export default api;