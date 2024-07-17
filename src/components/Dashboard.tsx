import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTemperature } from '../slices/temperatureSlice';

const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { temperature, loading, error } = useSelector((state: RootState) => state.temperature);

  useEffect(() => {
    dispatch(fetchTemperature());
  }, [dispatch]);

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Temperature: {temperature}</p>
      )}
    </div>
  );
};

export default Dashboard;
