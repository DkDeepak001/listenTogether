import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import {
  Audio,
  type AVPlaybackStatus,
  type AVPlaybackStatusSuccess,
} from "expo-av";
import { usePathname } from "expo-router";

import { type Track } from "@acme/api/src/router/types";

import { api } from "~/utils/api";
import { shuffleArray } from "~/utils/shuffleArray";
import { useAudioStore } from "~/store/audio";
import { useSongStore } from "~/store/player";
import { useQueueStore } from "~/store/queue";

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
    totalDuration,
  } = useSongStore();

  const { queue, setQueue } = useQueueStore();
  const [currentDuration, setCurrentDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const updateCurrentDuration = async () => {
      if (isPlaying && currentSound) {
        const status: AVPlaybackStatus =
          (await currentSound?.getStatusAsync()) as AVPlaybackStatusSuccess;
        setCurrentDuration(status.positionMillis);
        if (status.positionMillis >= status.durationMillis!) {
          console.log(status);
          // await currentSound.unloadAsync();
          await handleNextSong();
        } else {
          console.log("song not completed");
        }
      } else {
        console.log("clearInterval");
        clearInterval(interval as NodeJS.Timeout);
      }
    };

    interval = setInterval(updateCurrentDuration, 900);

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [currentSound]);

  const handlePlay = async (item: Track, type: typeof songType) => {
    try {
      console.log("handleplay");
      setType(type);
      if (currentTrack === item) {
        void pauseSong();
        return;
      }
      if (currentTrack !== item) {
        console.log("currentTrack !== item");
        await currentSound?.unloadAsync();
        setCurrentSound(null);
        setCurrentTrack(null);
        if (queue.length <= 0) await handleAddToQueue();
      }
      setCurrentSound(null);

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
      const { sound, status } = (await Audio.Sound.createAsync(
        {
          uri: item?.preview_url,
        },
        { isLooping: false, shouldPlay: true },
      )) as {
        sound: Audio.Sound;
        status: AVPlaybackStatusSuccess;
      };
      ToastAndroid.showWithGravity(
        `Playing Preview for 30 sec of ${item.name} `,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );

      setCurrentSound(sound);
      setCurrentTrack(item);
      setIsPlaying(status.isLoaded);
      setTotalDuration(status.durationMillis as number);
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const pauseSong = async () => {
    try {
      if (currentSound) {
        if (!isPaused) {
          await currentSound.pauseAsync();
          setIsPaused(true);
        } else {
          await currentSound.playAsync();
          setIsPaused(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const path = usePathname();
  const context = api.useContext();

  const handleAddToQueue = async () => {
    const songs = context.spotify.topTracks.getData();
    const shuffledSong = shuffleArray<Track>(songs?.items!);
    setQueue([...shuffledSong]);
  };
  const handleNextSong = async () => {
    try {
      console.log("handleNextSong_______");
      console.log(queue.length);
      if (queue.length > 0) {
        const nextSong = queue.shift();
        console.log(nextSong?.name);
        if (nextSong) {
          setQueue([...queue]);
          handlePlay(nextSong, "SPOTIFY");
          console.log(queue[0]?.name);
        }
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
    handleNextSong,
  } as {
    handlePlay: (item: Track, type: typeof songType) => void;
    isPlaying: boolean;
    isPaused: boolean;
    currentTrack: Track | null;
    pauseSong: () => void;
    currentDuration: number;
    currentSound: Audio.Sound | null;
    handleNextSong: () => void;
  };
};

export default useAudio;
