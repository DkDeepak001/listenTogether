import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";
import useAudio from "~/hooks/useAudio";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

const PlaylistPage = () => {
  const { id } = useLocalSearchParams();
  const { data: playlist, isLoading } = api.spotify.playlist.useQuery({
    id: id as string,
  });
  const { handlePlay, currentTrack, isPaused } = useAudio();

  if (isLoading) return <Text className="text-black">Loading...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={playlist?.tracks?.items ?? []}
        renderItem={({ item }) => {
          if (!item?.track?.album?.images[0]?.url) return <></>;
          return (
            <View className="my-2 flex flex-row items-center justify-between  px-5">
              <View className="flex flex-row items-center gap-x-2 ">
                <Image
                  className="h-16 w-16 rounded-2xl"
                  source={{ uri: item?.track?.album?.images[0]?.url ?? "" }}
                  alt={item?.track?.name}
                />
                <View className="flex w-3/5 flex-col">
                  <Text
                    className="text-sm font-semibold text-white"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item?.track?.name}
                  </Text>
                  <Text className="text-white">
                    {item?.track?.artists[0]?.name}
                  </Text>
                </View>
              </View>
              <Pressable
                className="  h-8  w-8  items-center justify-center rounded-full bg-blue-800"
                onPress={() => void handlePlay(item.track, "SPOTIFY")}
              >
                <Image
                  className="h-4 w-4 rounded-full bg-blue-800"
                  source={
                    currentTrack === item ? (isPaused ? play : pause) : play
                  }
                  alt="pause"
                />
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <Text className="text-white">No tracks found</Text>
        )}
        ListHeaderComponent={() => (
          <View className="mb-2 h-96 w-full">
            <Image
              className="h-full w-full  rounded-b-3xl opacity-50"
              contentFit="cover"
              source={{ uri: playlist?.images[0]?.url ?? "" }}
              alt={playlist?.name}
            />
            <View className="absolute bottom-0 left-5 h-1/4 w-full bg-black opacity-10"></View>
            <View className="absolute bottom-2 left-5 flex flex-col gap-y-1">
              <Text className=" text-2xl font-extrabold text-white">
                {playlist?.name ?? ""}
              </Text>
              <View className="flex flex-row gap-x-5">
                <Text className=" text-sm font-extrabold text-white">
                  {playlist?.owner?.display_name ?? ""}
                </Text>
                <Text className=" text-sm font-extrabold text-white">
                  {playlist?.tracks?.total ?? 0} songs
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default PlaylistPage;
