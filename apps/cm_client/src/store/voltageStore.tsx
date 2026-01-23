import { create } from 'zustand';

type VoltageStatus = 'normal' | 'warning' | 'critical';

interface VoltageState {
  voltage_0: number
  voltage_1: number
  voltage_2: number
  voltageStatuses: Record<string, VoltageStatus>
  setVoltageValue: (field: string, value: number) => void
  setVoltageStatus: (voltageKey: string, status: VoltageStatus) => void
  setAllVoltages: (voltages: Record<string, number>) => void
}

export const useVoltageStore = create<VoltageState>((set) => ({
  voltage_0: 0,
  voltage_1: 0,
  voltage_2: 0,
  voltageStatuses: {
    voltage_0: 'normal',
    voltage_1: 'normal',
    voltage_2: 'normal',
  },
  setVoltageValue: (field, value) =>
    set((state) => ({ ...state, [field]: value })),
  setVoltageStatus: (voltageKey, status) =>
    set((state) => ({
      voltageStatuses: { ...state.voltageStatuses, [voltageKey]: status },
    })),
  setAllVoltages: (voltages) => set((state) => ({ ...state, ...voltages })),
}))


