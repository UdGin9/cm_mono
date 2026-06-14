import { create } from "zustand";

type StateLevel = {
  sensor_0: number,
  sensor_1: number,
  sensor_2: number,
  sensor_3: number
  sensor_4: number
  load_vagon_1: number, 
  load_vagon_2: number, 
  load_vagon_3: number,
  load_all: number,
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
  load_vagon_1: 0,
  load_vagon_2: 0,
  load_vagon_3: 0,
  load_all: 0,
  setLevels: (levels) => set(levels),
}))
