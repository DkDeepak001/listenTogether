import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import { type Track } from "@acme/api/src/router/types";

import { api } from "~/utils/api";
import SongCard from "~/components/card/song";
import Loader from "~/components/loader";
import useAudio from "~/hooks/useAudio";

const AlbumPage = () => {
  const { id } = useLocalSearchParams();
  const { data: album, isLoading } = api.spotify.album.useQuery({
    id: id as string,
  });

  const { isPlaying, handlePlay, currentTrack, isPaused } = useAudio();

  if (isLoading) return <Loader />;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={album?.tracks.items ?? []}
        renderItem={({ item }) => {
          return (
            <SongCard
              item={item}
              currentTrack={currentTrack}
              handlePlay={(item: Track, type: "SPOTIFY" | "UPLOAD" | null) =>
                handlePlay(item, type)
              }
              isPaused={isPaused}
            />
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
              source={{ uri: album?.images[0]?.url ?? "" }}
              alt={album?.name}
            />
            <View className="absolute bottom-0 left-5 h-1/4 w-full bg-black opacity-10"></View>
            <View className="absolute bottom-2 left-5 flex flex-col gap-y-1">
              <Text className=" text-2xl font-extrabold text-white">
                {album?.name}
              </Text>
              <Text className=" text-sm font-extrabold text-white">
                {album?.artists[0]?.name}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AlbumPage;
