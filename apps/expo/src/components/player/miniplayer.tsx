import React from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { Image } from "expo-image";

import { type api } from "~/utils/api";
import upArrow from "../../../assets/player/downArrow.svg";

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
      <View className="flex flex-row">
        <Image
          source={{ uri: player?.item?.album?.images[0]?.url }}
          className="mr-2 h-10 w-10 rounded-2xl"
          alt={player?.item?.name}
        />
        <View className="flex w-4/5 flex-col gap-y-1">
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
        <Pressable className="flex items-center justify-center">
          <Image
            source={upArrow}
            className="h-4 w-5 rotate-180"
            alt="upArrow"
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default Miniplayer;
