import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { Audio, type AVPlaybackStatus } from "expo-av";

import { type Track } from "@acme/api/src/router/types";

import { useAudioStore } from "~/store/audio";
import { useSongStore } from "~/store/player";

const useAudio = () => {
  const {
    isPlaying,
    setIsPlaying,
    currentSound,
    currentTrack,
    setCurrentTrack,
    setCurrentSound,
    isPaused,
    setIsPaused,
  } = useAudioStore();

  const {
    setTotalDuration,
    setType,
    type: songType,
    currentDuration,
    setCurrentDuration,
  } = useSongStore();

  // const [currentDuration, setCurrentDuration] = useState<number>(0);

  // Update the current duration every second when the song is playing
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   const updateCurrentDuration = async () => {
  //     if (isPlaying && currentSound) {
  //       const status: AVPlaybackStatus = await currentSound.getStatusAsync();
  //       setCurrentDuration(status.positionMillis || 0);
  //     } else {
  //       clearInterval(interval);
  //     }
  //   };

  //   interval = setInterval(updateCurrentDuration, 500);

  //   return () => clearInterval(interval);
  // }, [isPlaying, currentSound]);

  const handlePlay = async (item: Track, type: typeof songType) => {
    try {
      setType(type);
      if (type === "SPOTIFY") setTotalDuration(30000);
      if (currentTrack === item && isPlaying) {
        await currentSound?.pauseAsync();
        setIsPlaying(false);
        return;
      }

      setCurrentTrack(item);
      if (currentSound) {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      if (!item?.preview_url)
        return ToastAndroid.showWithGravity(
          `No Preview Available for ${item.name} `,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: item?.preview_url,
        },
        { isLooping: false, shouldPlay: true },
      );
      ToastAndroid.showWithGravity(
        `Playing Preview for 30 sec of ${item.name} `,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      setCurrentSound(sound);
      setCurrentDuration(0); // Reset the current duration when starting a new song

      setIsPlaying(status.isLoaded);
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const pauseSong = async () => {
    try {
      if (currentSound) {
        await currentSound.pauseAsync();
        setIsPaused(true);
        // setCurrentSound(null);
        // setCurrentTrack(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handlePlay,
    isPlaying,
    isPaused,
    currentTrack,
    pauseSong,
    currentDuration,
    currentSound,
  } as {
    handlePlay: (item: Track, type: typeof songType) => void;
    isPlaying: boolean;
    isPaused: boolean;
    currentTrack: Track | null;
    pauseSong: () => void;
    currentDuration: number;
    currentSound: Audio.Sound | null;
  };
};

export default useAudio;
