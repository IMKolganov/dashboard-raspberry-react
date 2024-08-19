import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTemperature } from '../slices/temperatureSlice';
import { fetchSoilMoisture } from '../slices/soilMoistureSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  const { temperature, humidity, loading: tempLoading, error: tempError } = useSelector((state: RootState) => state.temperature);
  const { soilMoisture, loading: moistureLoading, error: moistureError } = useSelector((state: RootState) => state.soilMoisture);

  useEffect(() => {
    dispatch(fetchTemperature());
    dispatch(fetchSoilMoisture());

    // Start camera stream if videoRef is defined
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            // Stop existing tracks if any
            const existingStream = videoRef.current.srcObject as MediaStream;
            if (existingStream) {
              existingStream.getTracks().forEach(track => track.stop());
            }
            videoRef.current.srcObject = stream;
            setHasCameraAccess(true);
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          setHasCameraAccess(false);
        });
    }

    return () => {
      // Clean up stream when component unmounts
      if (videoRef.current) {
        const existingStream = videoRef.current.srcObject as MediaStream;
        if (existingStream) {
          existingStream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Play the video stream after it has been set
    if (videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.onloadedmetadata = () => {
        videoElement.play().catch(error => {
          console.error('Error playing video:', error);
        });
      };
    }
  }, [videoRef.current?.srcObject]);

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
        <video ref={videoRef} width="600" height="400" autoPlay playsInline>
          Your browser does not support the video tag.
        </video>
        {!hasCameraAccess && <p className="text-danger">Unable to access the camera.</p>}
      </div>

      <div id="dashboard-temperature" className="mb-3 p-3 border rounded">
        {tempLoading ? (
          <p>Loading...</p>
        ) : tempError ? (
          <p className="text-danger">{tempError}</p>
        ) : (
          <p>Temperature: {temperature !== null ? temperature : 'N/A'} Humidity: {humidity !== null ? humidity : 'N/A'}</p>
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
          <p>Soil moisture: {soilMoisture !== null ? soilMoisture : 'N/A'}</p>
        )}
        <button onClick={handleRefreshSoilMoisture} className="btn btn-primary mt-2">
          <FontAwesomeIcon icon={faSyncAlt} />
        </button>
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
