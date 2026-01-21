import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { VoltageToast } from '../pages/VoltagePage/components/VoltageToast';

export interface VoltageEvent {
  voltage: string;
  value: number;
  type: 'warning' | 'critical';
  message: string;
}

const api = import.meta.env.VITE_BASE_RASPBERRY_5_URL;

export const useVoltageEvents = () => {
  const lastToastId = useRef<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${api}/voltage/events`);

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as VoltageEvent;

        const eventId = `${data.voltage}-${data.value}-${data.type}`;
        if (lastToastId.current === eventId) return;
        lastToastId.current = eventId;

        if (data.type === 'critical') {
          toast.error(
            <VoltageToast {...data} />,
            {
              toastId: eventId,
              autoClose: 5000,
              closeButton: true,
              position: 'top-center',
            }
          );
        } else if (data.type === 'warning') {
          toast.warning(
            <VoltageToast {...data} />,
            {
              toastId: eventId,
              autoClose: 3000,
              closeButton: true,
              position: 'top-center',
            }
          );
        }
      } catch (err) {
        console.error('Ошибка парсинга SSE-события:', err);
      }
    };

    eventSource.onerror = () => {
      console.warn('SSE: потеряно соединение с /voltage/events');
    };

    return () => {
      eventSource.close();
    };
  }, [api]);
};