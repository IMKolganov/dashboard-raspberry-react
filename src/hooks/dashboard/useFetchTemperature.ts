// hooks/dashboard/useFetchTemperature.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { countTryAttempts, hostAPI } from '../../const/api';

const useFetchTemperature = () => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTemperature = async (attempt: number = 1) => {
        try {
            const response = await axios.get(`${hostAPI}/api/temperature`);
            setTemperature(response.data.temperature);
            setLoading(false);
        } catch (err) {
            if (attempt < countTryAttempts) {
                setTimeout(() => {
                    fetchTemperature(attempt + 1);
                }, 1000);
            } else {
                setError(`Failed to fetch temperature after ${countTryAttempts} attempts`);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchTemperature();
    }, []);

    return { temperature, loading, error };
};

export default useFetchTemperature;
