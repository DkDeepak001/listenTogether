import React from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { Image } from "expo-image";

import { type api } from "~/utils/api";

type MiniplayerProps = {
  player: ReturnType<
    ReturnType<typeof api.useContext>["player"]["getPlayBackState"]["getData"]
  >;
  pressableProps: PressableProps;
};

const Miniplayer = ({ player, pressableProps }: MiniplayerProps) => {
  return (
    <Pressable
      className=" w-ffull flex  flex-row items-center rounded-t-3xl bg-white/20 px-5 py-3 backdrop-blur-sm"
      {...pressableProps}
    >
      <Image
        source={{ uri: player?.item?.album?.images[0]?.url }}
        className="mr-2 h-10 w-10 rounded-2xl"
        alt={player?.item?.name}
      />
      <View className="flex w-full flex-col gap-y-1">
        <Text
          className="font-lg w-3/5  text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player?.item?.name}
        </Text>
        <Text
          className="font-lg text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player?.item?.album?.artists[0]?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default Miniplayer;
