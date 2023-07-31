import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import { api } from "~/utils/api";
import useAudio from "~/hooks/useAudio";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

const ArtistPage = () => {
  const { id } = useLocalSearchParams();
  const { data: artist, isLoading } = api.spotify.artist.useQuery({
    id: id as string,
  });

  const { isPaused, handlePlay, currentTrack } = useAudio();

  if (isLoading) return <Text className="text-black">Loading...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={artist?.topTracks?.tracks ?? []}
        renderItem={({ item }) => (
          <View className="my-2 flex flex-row items-center justify-between gap-x-2 px-5">
            <View className="flex flex-row items-center gap-x-3">
              <Image
                className="h-16 w-16 rounded-2xl"
                source={{ uri: item?.album?.images[0]?.url }}
                alt={item?.name}
              />
              <View className="flex flex-col">
                <Text className="text-white">{item?.name}</Text>
                <Text className="text-white">{item?.artists[0]?.name}</Text>
              </View>
            </View>
            <Pressable
              className="  h-8  w-8  items-center justify-center rounded-full bg-blue-800"
              onPress={() => void handlePlay(item, "SPOTIFY")}
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
        )}
        ListEmptyComponent={() => (
          <Text className="text-white">No tracks found</Text>
        )}
        ListHeaderComponent={() => (
          <View className="mb-2 h-96 w-full">
            <Image
              className="h-full w-full  rounded-b-3xl opacity-50"
              contentFit="cover"
              source={{ uri: artist?.artist?.images[0]?.url ?? "" }}
              alt={artist?.artist?.name}
            />
            <View className="absolute bottom-0 left-5 h-1/4 w-full bg-black opacity-10"></View>
            <View className="absolute bottom-2 left-5 flex flex-col gap-y-1">
              <Text className=" text-2xl font-extrabold text-white">
                {artist?.artist?.name}
              </Text>
              <Text className=" text-sm font-extrabold text-white">
                {artist?.artist?.followers?.total ?? 0}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ArtistPage;
