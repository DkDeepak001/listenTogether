import { useState } from "react";
import { ToastAndroid } from "react-native";
import { Audio } from "expo-av";

import {
  type CurrentlyPlayingResponse,
  type Track,
} from "@acme/api/src/router/types";

const useAudio = () => {
  const [currnetSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  const handlePlay = async (item: Track) => {
    try {
      if (currentTrack === item && playing) {
        await currnetSound?.pauseAsync();
        setPlaying(false);
        return;
      }

      setCurrentTrack(item);
      if (currnetSound) {
        await currnetSound.pauseAsync();
        setPlaying(false);
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

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
      setPlaying(status.isLoaded);
      await sound.playAsync();

      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };
  return {
    handlePlay,
    playing,
    currentTrack,
  } as {
    handlePlay: (item: Track) => void;
    playing: boolean;
    currentTrack: Track | null;
  };
};

export default useAudio;
