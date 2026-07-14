import React, { useState, useEffect } from 'react';
import { fetchChangePoints } from '../services/api';
import './ChangePointDisplay.css';

const ChangePointDisplay = () => {
  const [changePoints, setChangePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChangePoints();
  }, []);

  const loadChangePoints = async () => {
    try {
      setLoading(true);
      const data = await fetchChangePoints();
      setChangePoints(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load change points');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="change-point-display">Loading change points...</div>;
  }

  if (error) {
    return <div className="change-point-display error">{error}</div>;
  }

  if (changePoints.length === 0) {
    return (
      <div className="change-point-display">
        <h4>🔍 Change Points</h4>
        <p className="no-data">No change points detected. Run the analysis first.</p>
      </div>
    );
  }

  return (
    <div className="change-point-display">
      <h4>🔍 Detected Change Points</h4>
      <div className="change-points-list">
        {changePoints.map((cp, idx) => (
          <div key={idx} className="change-point-item">
            <div className="cp-header">
              <span className="cp-date">{cp.change_date}</span>
              <span className="cp-index">#{cp.tau_median}</span>
            </div>
            <div className="cp-details">
              <div className="cp-metric">
                <span className="metric-label">Pre-change:</span>
                <span className="metric-value">${cp.mu1_mean?.toFixed(2) || 'N/A'}</span>
                <span className="metric-ci">(${cp.mu1_lower?.toFixed(2) || 'N/A'} - ${cp.mu1_upper?.toFixed(2) || 'N/A'})</span>
              </div>
              <div className="cp-metric">
                <span className="metric-label">Post-change:</span>
                <span className="metric-value">${cp.mu2_mean?.toFixed(2) || 'N/A'}</span>
                <span className="metric-ci">(${cp.mu2_lower?.toFixed(2) || 'N/A'} - ${cp.mu2_upper?.toFixed(2) || 'N/A'})</span>
              </div>
              <div className="cp-change">
                <span className="change-label">Change:</span>
                <span className={`change-value ${(cp.mu2_mean - cp.mu1_mean) > 0 ? 'positive' : 'negative'}`}>
                  {((cp.mu2_mean - cp.mu1_mean) > 0 ? '+' : '')}
                  ${(cp.mu2_mean - cp.mu1_mean)?.toFixed(2) || 'N/A'}
                  ({((cp.mu2_mean - cp.mu1_mean) / cp.mu1_mean * 100)?.toFixed(1) || 'N/A'}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangePointDisplay;