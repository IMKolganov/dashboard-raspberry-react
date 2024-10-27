import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTemperature } from '../slices/temperatureSlice';
import { fetchSoilMoisture } from '../slices/soilMoistureSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { temperature, humidity, loading: tempLoading, error: tempError } = useSelector((state: RootState) => state.temperature);
  const { soilMoisture, loading: moistureLoading, error: moistureError } = useSelector((state: RootState) => state.soilMoisture);

  useEffect(() => {
    dispatch(fetchTemperature());
    dispatch(fetchSoilMoisture());
  }, [dispatch]);

  const handleRefreshTemperature = () => {
    dispatch(fetchTemperature());
  };

  const handleRefreshSoilMoisture = () => {
    dispatch(fetchSoilMoisture());
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      <div id="dashboard-video" className="mb-3 p-3 border rounded">
        <h3>Live Video Stream</h3>
        <img
          src="http://localhost:5003/video_feed"
          alt="Video Stream"
          width="640"
          height="480"
        />
      </div>

      <div id="dashboard-temperature" className="mb-3 p-3 border rounded">
        {tempLoading ? (
          <p>Loading...</p>
        ) : tempError ? (
          <p className="text-danger">{tempError}</p>
        ) : (
          <p>Temperature: {temperature !== null ? temperature : 'N/A'} °C Humidity: {humidity !== null ? humidity : 'N/A'} %</p>
        )}
        <button onClick={handleRefreshTemperature} className="btn btn-primary mt-2">
          <FontAwesomeIcon icon={faSyncAlt} />
        </button>
      </div>
      
      <div id="dashboard-soil-moisture" className="mb-3 p-3 border rounded">
        {moistureLoading ? (
          <p>Loading...</p>
        ) : moistureError ? (
          <p className="text-danger">{moistureError}</p>
        ) : (
          <p>Soil moisture: {soilMoisture !== null ? soilMoisture : 'N/A'} %</p>
        )}
        <button onClick={handleRefreshSoilMoisture} className="btn btn-primary mt-2">
          <FontAwesomeIcon icon={faSyncAlt} />
        </button>
      </div>

      <div className="mb-3 p-3 border rounded">
        <p>Last pump: 12.12.2004 12:00</p>
        <p> 
        <button className="btn btn-primary">Start pump 1</button>
        <button className="btn btn-primary">Start pump 2</button>
        <button className="btn btn-primary">Start pump all</button>
        </p>
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
