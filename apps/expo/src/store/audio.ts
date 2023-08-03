import { type Audio } from "expo-av";
import { create } from "zustand";

import { type Track } from "@acme/api/src/router/types";

interface AudioState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentSound: Audio.Sound | null;
  setCurrentSound: (currentSound: Audio.Sound | null) => void;
  currentTrack: Track | null;
  setCurrentTrack: (currentTrack: Track | null) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },
  currentSound: null,
  setCurrentSound: (currentSound: Audio.Sound | null) => {
    set({ currentSound });
  },
  currentTrack: null,
  setCurrentTrack: (currentTrack: Track | null) => {
    set({ currentTrack });
  },
  isPaused: false,
  setIsPaused: (isPaused: boolean) => {
    set({ isPaused });
  },
}));
