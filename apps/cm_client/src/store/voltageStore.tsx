import { create } from 'zustand';

type VoltageStatus = 'normal' | 'warning' | 'critical';

const MAX_HISTORY = 30;
const VOLTAGE_KEYS = ['voltage_0', 'voltage_1', 'voltage_2'] as const;
type VoltageKey = typeof VOLTAGE_KEYS[number];

interface VoltageState {
  voltage_0: number
  voltage_1: number
  voltage_2: number
  voltage_warning_count: 0
  nominal: number
  tolerance: number
  voltageStatuses: Record<string, VoltageStatus>
  voltageHistory: Record<VoltageKey, number[]>
  setVoltageValue: (field: string, value: number) => void
  setVoltageStatus: (voltageKey: string, status: VoltageStatus) => void
  setAllVoltages: (voltages: Record<string, number>) => void
  setNominal: (nominal: number, tolerance: number) => void
}

export const useVoltageStore = create<VoltageState>((set) => ({
  voltage_0: 0,
  voltage_1: 0,
  voltage_2: 0,
  nominal: 3.3,
  tolerance: 0.2,
  voltageStatuses: {
    voltage_0: 'normal',
    voltage_1: 'normal',
    voltage_2: 'normal',
  },
  voltageHistory: {
    voltage_0: [],
    voltage_1: [],
    voltage_2: [],
  },
  voltage_warning_count: 0,
  setVoltageValue: (field, value) =>
    set((state) => ({ ...state, [field]: value })),
  setVoltageStatus: (voltageKey, status) =>
    set((state) => ({
      voltageStatuses: { ...state.voltageStatuses, [voltageKey]: status },
    })),
  setAllVoltages: (voltages) =>
    set((state) => {
      const voltageHistory = { ...state.voltageHistory };
      for (const key of VOLTAGE_KEYS) {
        const value = voltages[key];
        if (typeof value === 'number') {
          voltageHistory[key] = [...state.voltageHistory[key], value].slice(-MAX_HISTORY);
        }
      }
      return { ...state, ...voltages, voltageHistory };
    }),
  setNominal: (nominal, tolerance) => set({ nominal, tolerance }),
}))


