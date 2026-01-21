import React from 'react'
import s from './VoltageToast.module.scss'

interface VoltageToastProps {
  message: string;
  voltage: string;
  value: number;
  type: 'warning' | 'critical';
}

export const VoltageToast: React.FC<VoltageToastProps> = ({ message, voltage, value, type }) => {
  return (
    <div className={`${s.toast} ${s[type]}`}>
      <strong className={s.message}>{message}</strong>
      <small className={s.details}>
        Датчик: <code>{voltage + 1}</code> | Напряжение: <code>{value}V</code>
      </small>
    </div>
  )
}