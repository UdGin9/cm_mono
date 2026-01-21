import { useEffect } from 'react';
import { useVoltageStore } from '../store/voltageStore';

const api = import.meta.env.VITE_BASE_RASPBERRY_5_URL;

export const useVoltagePoling = () => {
  const setVoltages = useVoltageStore((state) => state.setVoltages)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(api + '/voltage');
        const data = await res.json();
        setVoltages(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData()
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, [setVoltages]);
}