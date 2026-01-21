import { create } from 'zustand';

type StateVoltages = {
  voltage_1: number,
  voltage_2: number,
  voltage_3: number,
}

type ActionsVoltages = {
  setVoltages: (levels: Partial<StateVoltages>) => void;
}

export const useVoltageStore = create<StateVoltages & ActionsVoltages>((set) => ({

  voltage_1: 0,
  voltage_2: 0,
  voltage_3: 0,

  setVoltages: (voltages) => set(voltages),
}))


