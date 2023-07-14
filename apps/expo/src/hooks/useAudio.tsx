import { ToastAndroid } from "react-native";
import { Audio } from "expo-av";

import { type Track } from "@acme/api/src/router/types";

import { useAudioStore } from "~/store/audio";

const useAudio = () => {
  const {
    isPlaying,
    setIsPlaying,
    currentSound,
    currentTrack,
    setCurrentTrack,
    setCurrentSound,
  } = useAudioStore();

  const handlePlay = async (item: Track) => {
    try {
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
      setIsPlaying(status.isLoaded);
      await sound.playAsync();

      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };
  return {
    handlePlay,
    isPlaying,
    currentTrack,
  } as {
    handlePlay: (item: Track) => void;
    isPlaying: boolean;
    currentTrack: Track | null;
  };
};

export default useAudio;
