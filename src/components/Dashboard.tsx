// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await axios.get('/api/temperature');
        setTemperature(response.data.temperature);
      } catch (err) {
        setError('Failed to fetch temperature');
      } finally {
        setLoading(false);
      }
    };

    fetchTemperature();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Dashboard for all information about all services in world!</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Current Temperature: {temperature}°C</p>
      )}
    </div>
  );
};

export default Dashboard;
