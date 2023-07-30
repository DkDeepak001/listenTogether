import { create } from "zustand";

interface songState {
  type: "SPOTIFY" | "UPLOAD" | null;
  setType: (type: "SPOTIFY" | "UPLOAD" | null) => void;
  totalDuration: number;
  setTotalDuration: (totalDuration: number) => void;
  currentDuration: number;
  setCurrentDuration: (currentDuration: number) => void;
}

export const useSongStore = create<songState>((set) => ({
  type: null,
  setType: (type: "SPOTIFY" | "UPLOAD" | null) => set({ type }),
  totalDuration: 0,
  setTotalDuration: (totalDuration: number) => set({ totalDuration }),
  currentDuration: 1000,
  setCurrentDuration: (currentDuration) =>
    set({ currentDuration: currentDuration + 1000 }),
}));
