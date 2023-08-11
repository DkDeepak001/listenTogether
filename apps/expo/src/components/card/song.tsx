import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { type Track } from "@acme/api/src/router/types";

import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

type SongCardProps = {
  item: Track;
  handlePlay: (item: Track, type: "SPOTIFY" | "UPLOAD" | null) => void;
  currentTrack: Track | null;
  isPaused: boolean;
};

const SongCard = ({
  item,
  currentTrack,
  handlePlay,
  isPaused,
}: SongCardProps) => {
  return (
    <View className="my-2 flex flex-row items-center justify-between">
      <View className="flex w-4/5 flex-row gap-x-5">
        <Image
          source={{ uri: item.album.images[0]?.url }}
          className="h-16 w-16 rounded-2xl"
          alt={item.name}
        />
        <View className="flex w-3/5 flex-col justify-center">
          <Text
            className="text-lg font-semibold text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text className="text-xs font-bold text-white">
            {item.artists[0]?.name}
          </Text>
        </View>
      </View>
      <Pressable
        className="  h-8  w-8  items-center justify-center rounded-full bg-blue-800"
        onPress={() => void handlePlay(item, "SPOTIFY")}
      >
        <Image
          className="h-4 w-4 rounded-full bg-blue-800"
          source={currentTrack === item ? (isPaused ? play : pause) : play}
          alt="pause"
        />
      </Pressable>
    </View>
  );
};

export default SongCard;
