import { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import {
  Audio,
  type AVPlaybackStatus,
  type AVPlaybackStatusSuccess,
} from "expo-av";

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

  const { data: allUploads } = api.upload.all.useQuery();
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
          setIsPaused(true);
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
        await currentSound?.unloadAsync();
        setCurrentSound(null);
        setCurrentTrack(null);

        if (queue.length <= 0) await handleAddToQueue();
      }
      setCurrentSound(null);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
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
        type === "SPOTIFY"
          ? `Playing Preview for 30 sec of ${item.name} `
          : `Playing ${item.name}`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );

      setCurrentSound(sound);
      setCurrentTrack(item);
      setIsPlaying(status.isLoaded);
      setIsPaused(false);
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

  const handleAddToQueue = async () => {
    const shuffledSong = shuffleArray<Track>(allUploads!);
    setQueue([...shuffledSong]);
  };
  const handleNextSong = async () => {
    try {
      if (queue.length > 0) {
        const nextSong = queue.shift();
        if (nextSong) {
          setQueue([...queue]);
          handlePlay(nextSong, "SPOTIFY");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setLiveSong = async ({
    currentTrack,
    currentSound: wsSound,
  }: {
    currentTrack: Track;
    currentSound: AVPlaybackStatusSuccess;
  }) => {
    try {
      console.log("setLiveSong");
      await currentSound?.unloadAsync();
      setCurrentSound(null);
      setCurrentTrack(null);

      const { sound, status } = (await Audio.Sound.createAsync(
        {
          uri: currentTrack?.preview_url ?? "",
        },
        {
          isLooping: false,
          shouldPlay: true,
          positionMillis: wsSound?.positionMillis + 5950,
        },
      )) as {
        sound: Audio.Sound;
        status: AVPlaybackStatusSuccess;
      };
      setIsPlaying(status.isLoaded);
      setCurrentTrack(currentTrack);
      setCurrentSound(sound);
      setTotalDuration(status.durationMillis as number);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeekSong = async (value: number) => {
    const seeek = Math.floor((value / 100) * totalDuration);
    if (isPlaying && currentSound) await currentSound.setPositionAsync(seeek);
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
    handleSeekSong,
    setLiveSong,
  } as {
    handlePlay: (item: Track, type: typeof songType) => void;
    isPlaying: boolean;
    isPaused: boolean;
    currentTrack: Track | null;
    pauseSong: () => void;
    currentDuration: number;
    currentSound: Audio.Sound | null;
    handleNextSong: () => void;
    handleSeekSong: (value: number) => void;
    setLiveSong: (item: any) => void;
  };
};

export default useAudio;
