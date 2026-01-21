import { create } from "zustand";

type StateLevel = {
  sensor_0: number,
  sensor_1: number,
  sensor_2: number,
  sensor_3: number
  sensor_4: number
}

type ActionsLevel= {
  setLevels: (levels: Partial<StateLevel>) => void;
}

export const useLevelStore = create<StateLevel & ActionsLevel>((set) => ({

  sensor_0: 0,
  sensor_1: 0,
  sensor_2: 0,
  sensor_3: 0,
  sensor_4: 0,

  setLevels: (levels) => set(levels),
}))
