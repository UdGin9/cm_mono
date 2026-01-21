import { useEffect } from 'react';
import { useLevelStore } from '../store/levelStore';

const api = import.meta.env.VITE_BASE_RASPBERRY_5_URL;

export const useSensorPolling = () => {
  const setLevels = useLevelStore((state) => state.setLevels)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(api + '/sensors');
        const data = await res.json();
        setLevels(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData()
    const id = setInterval(fetchData, 3000);
    return () => clearInterval(id);
  }, [setLevels]);
}