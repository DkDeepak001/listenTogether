import { create } from "zustand";

import { type Track } from "@acme/api/src/router/types";

interface queueState {
  queue: Track[];
  setQueue: (queue: Track[]) => void;
}

export const useQueueStore = create<queueState>((set) => ({
  queue: [],
  setQueue: (queue: Track[]) => set({ queue }),
}));
