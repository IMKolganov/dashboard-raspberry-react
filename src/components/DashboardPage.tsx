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
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      <div id="dashboard-video" className="mb-3 p-3 border rounded">
        <p>Video stream is not available</p>
      </div>
      
      <div id="dashboard-temperature" className="mb-3 p-3 border rounded">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <p>Temperature: {temperature} Humidify: 40%</p>
        )}
      </div>
      
      <div id="dashboard-soil-moisture" className="mb-3 p-3 border rounded">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <p>Soil moisture: {temperature}</p>
        )}
      </div>

      <div className="mb-3 p-3 border rounded">
        <p>Last pump: 12.12.2004 12:00</p>
        <button className="btn btn-primary">BtnPump (1 second)</button>
      </div>
      
      <div className="mb-3 p-3 border rounded">
        <p>
          Microcontroller: Available Connection type: Wifi/USB<br/><br/>
          Microservice MicrocontrollerManager: Available Version: 1.0<br/>
          Microservice GetSoilMoisture: Available Version: 1.0<br/>
          Microservice GetSoilTemperatureAndHumidify: Available Version: 1.0<br/>
          Microservice PumpController: Available Version: 1.0<br/>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;