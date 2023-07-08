import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

import { type api } from "~/utils/api";

type MiniplayerProps = {
  player: ReturnType<
    ReturnType<typeof api.useContext>["player"]["getPlayBackState"]["getData"]
  >;
};

const Miniplayer = ({ player }: MiniplayerProps) => {
  return (
    <View className=" flex flex-row  items-center rounded-t-3xl bg-white/20 px-5 py-3 backdrop-blur-sm">
      <Image
        source={{ uri: player?.item?.album?.images[0]?.url }}
        className="mr-2 h-10 w-10 rounded-2xl"
        alt={player?.item?.name}
      />
      <View className="flex flex-col gap-y-1">
        <Text
          className="font-lg w-3/5 text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player?.item?.album?.name}
        </Text>
        <Text
          className="font-lg text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player?.item?.album?.artists[0]?.name}
        </Text>
      </View>
    </View>
  );
};

export default Miniplayer;
