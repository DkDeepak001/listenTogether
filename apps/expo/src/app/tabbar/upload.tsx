import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { type Track } from "@acme/api/src/router/types";

import { api } from "~/utils/api";
import SongCard from "~/components/card/song";
import Loader from "~/components/loader";
import useAudio from "~/hooks/useAudio";

const Uploaded = () => {
  const { currentTrack, handlePlay, isPaused } = useAudio();
  const router = useRouter();
  const { data: allSongs, isLoading } = api.upload.all.useQuery();
  if (isLoading) return <Loader />;

  return (
    <View className="flex-1 bg-black p-5">
      <FlatList
        data={allSongs}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-extrabold text-white">
              No song found
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SongCard
            item={item}
            currentTrack={currentTrack}
            handlePlay={(item: Track, type: "SPOTIFY" | "UPLOAD" | null) =>
              handlePlay(item, type)
            }
            isPaused={isPaused}
          />
        )}
        ListHeaderComponent={() => (
          <Pressable
            className="my-5 flex w-full flex-row items-center justify-center  rounded-lg bg-blue-500 p-2"
            onPress={() => router.push("/upload/upload")}
          >
            <Image
              source={require("../../../assets/tabbar/upload.svg")}
              className="mr-2 h-5 w-5"
              alt="Upload"
            />
            <Text className="text-lg font-semibold text-white">Upload</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Uploaded;
