import React, { useEffect, useState } from "react";
import { Pressable, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type AVPlaybackStatus, type AVPlaybackStatusSuccess } from "expo-av";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";

import { api } from "~/utils/api";
import { formatDuration } from "~/utils/convertMillSecond";
import useAudio from "~/hooks/useAudio";
import { useSongStore } from "~/store/player";
import downArrow from "../../../assets/player/downArrow.svg";
import next from "../../../assets/player/next.svg";
import pause from "../../../assets/player/pause.svg";
import resume from "../../../assets/player/resume.svg";

const FullPlayer = () => {
  const router = useRouter();
  // const { player, playPercent, formattedEndduration, formattedStartingTime } =
  //   usePlayer();

  const { currentTrack, pauseSong, isPaused, currentDuration, handleSeekSong } =
    useAudio();
  const { totalDuration } = useSongStore();
  // const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   const updateCurrentDuration = async () => {
  //     if (isPlaying && currentSound) {
  //       const status: AVPlaybackStatus = await currentSound.getStatusAsync();
  //       setStatus(status);
  //     } else {
  //       clearInterval(interval);
  //     }
  //   };

  //   interval = setInterval(updateCurrentDuration, 500);

  //   return () => clearInterval(interval);
  // }, [isPlaying, currentSound]);
  const context = api.useContext();
  const user = context.spotify.self.getData();
  // const { mutateAsync: pauseSong } = api.player.pauseSong.useMutation();
  const { mutateAsync: playSong } = api.player.playSong.useMutation();
  const { mutateAsync: nextSong } = api.player.nextSong.useMutation();
  const { mutateAsync: prevSong } = api.player.prevSong.useMutation();
  const { mutateAsync: seekSong } = api.player.seekSong.useMutation();

  // if (!Number(playPercent)) return;

  // if (player.currently_playing_type === "ad") {
  //   ToastAndroid.show("Playing ads is not supported", ToastAndroid.SHORT);
  //   router.back();
  // }

  const handlePauseSong = async () => {
    pauseSong();
    // if (user?.product === "free")
    //   ToastAndroid.show(
    //     "You need to have a premium account to use this feature",
    //     ToastAndroid.SHORT,
    //   );
    // else {
    //   if (player.is_playing) {
    //     await pauseSong({ device_id: player.device.id });
    //   } else {
    //     await playSong({ device_id: player.device.id });
    //   }
    // }
  };

  const handleNextSong = async () => {
    // if (user?.product === "free")
    //   ToastAndroid.show(
    //     "You need to have a premium account to use this feature",
    //     ToastAndroid.SHORT,
    //   );
    // else await nextSong({ device_id: player.device.id });
  };

  const handlePrevSong = async () => {
    // if (user?.product === "free")
    //   ToastAndroid.show(
    //     "You need to have a premium account to use this feature",
    //     ToastAndroid.SHORT,
    //   );
    // else await prevSong({ device_id: player.device.id });
  };

  const playPercent = Math.floor((currentDuration / totalDuration) * 100) ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-black pt-5">
      <Pressable onPress={() => router.back()}>
        <Image
          source={downArrow}
          className="h-5 w-5 self-center  "
          contentFit="contain"
          alt="home"
        />
      </Pressable>
      <View className="mt-10 flex items-center">
        <Image
          source={{ uri: currentTrack?.album?.images[0]?.url }}
          className="h-72 w-72  rounded-2xl"
          alt={currentTrack?.name}
        />
        <Text className="mt-8 text-2xl font-bold text-white">
          {currentTrack?.name}
        </Text>
        <Text className="mt-2 text-2xl font-bold text-white">
          {currentTrack?.album?.artists[0]?.name}
        </Text>
        <View className="mt-8 flex flex-row items-center justify-center gap-x-5">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => void handlePrevSong()}
          >
            <Image
              source={next}
              className="rotate- h-6 w-6 rotate-180"
              alt="prev"
            />
          </Pressable>
          <Pressable
            className="h-14 w-14 items-center justify-center rounded-full bg-white"
            onPress={() => void handlePauseSong()}
          >
            <Image
              source={isPaused ? resume : pause}
              className="h-8 w-8 "
              alt="pause"
            />
          </Pressable>
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => void handleNextSong()}
          >
            <Image source={next} className="h-6 w-6 " alt="next" />
          </Pressable>
        </View>
        <View className="mt-8  w-11/12 ">
          <Text className=" absolute -top-2 left-5  text-xs text-white">
            {formatDuration(currentDuration || 0)}
          </Text>
          <Slider
            style={{ width: "100%", height: 50 }}
            minimumValue={0}
            maximumValue={100}
            value={isNaN(playPercent) ? 0 : playPercent}
            onSlidingComplete={(value) => handleSeekSong(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#FFFFFF"
          />
          <Text className=" absolute -top-2  right-5 text-xs text-white">
            {formatDuration(totalDuration) ?? `0:00`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FullPlayer;
