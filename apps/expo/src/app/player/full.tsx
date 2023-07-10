import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import WaveForm from "~/components/player/waveForm";
import usePlayer from "~/hooks/usePlayer";
import downArrow from "../../../assets/player/downArrow.svg";
import next from "../../../assets/player/next.svg";
import pause from "../../../assets/player/pause.svg";

const FullPlayer = () => {
  const router = useRouter();
  const { player } = usePlayer();
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
          source={{ uri: player?.item?.album?.images[0]?.url }}
          className="h-72 w-72  rounded-2xl"
          alt={player?.item?.name}
        />
        <Text className="mt-8 text-2xl font-bold text-white">
          {player?.item?.name}
        </Text>
        <Text className="mt-2 text-2xl font-bold text-white">
          {player?.item?.album?.artists[0]?.name}
        </Text>
        <View className="mt-8 flex flex-row items-center justify-center gap-x-5">
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Image
              source={next}
              className="rotate- h-6 w-6 rotate-180"
              alt="prev"
            />
          </Pressable>
          <Pressable className="h-14 w-14 items-center justify-center rounded-full bg-white">
            <Image source={pause} className="h-8 w-8 " alt="pause" />
          </Pressable>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Image source={next} className="h-6 w-6 " alt="next" />
          </Pressable>
        </View>
        <View className=" mt-10 h-1 w-10/12 rounded-lg bg-gray-600" />
        <WaveForm />
      </View>
    </SafeAreaView>
  );
};

export default FullPlayer;
