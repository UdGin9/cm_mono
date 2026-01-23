import React from 'react'
import s from './VoltageToast.module.scss'

interface VoltageToastProps {
  message: string;
  voltage: string;
  value: number;
}

const getWagonName = (voltage: string): string => {
  switch (voltage) {
    case 'voltage_0':
      return 'головном вагоне'
    case 'voltage_1':
      return 'промежуточном вагоне'
    case 'voltage_2':
      return 'концевом вагоне'
    default:
      return 'неизвестном месте'
  }
}

export const VoltageToast: React.FC<VoltageToastProps> = ({ message, voltage, value }) => {
  const wagonName = getWagonName(voltage)
  const fullMessage = `${message} в ${wagonName}!`

  return (
    <div className={s.containerToast}>
      <strong className={s.message}>{fullMessage}</strong>
      <small className={s.details}>
       Напряжение: <code>{value}V</code>
      </small>
    </div>
  )
}