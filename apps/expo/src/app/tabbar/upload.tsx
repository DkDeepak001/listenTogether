import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";
import useAudio from "~/hooks/useAudio";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

const Uploaded = () => {
  const { currentTrack, handlePlay, isPaused } = useAudio();
  const router = useRouter();
  const { data: allSongs, isLoading } = api.upload.all.useQuery();
  if (isLoading) return <Text>Loading...</Text>;

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
          <View className="my-2 flex flex-row items-center justify-between">
            <View className="flex w-4/5 flex-row gap-x-5">
              <Image
                source={{ uri: item.album.images[0]?.url }}
                className="h-16 w-16 rounded-2xl"
                alt={item.name}
              />
              <View className="flex flex-col justify-center">
                <Text className="text-lg font-extrabold text-white">
                  {item.name}
                </Text>
                <Text className="text-base font-bold text-white">
                  {item.artists[0]?.name}
                </Text>
              </View>
            </View>
            <Pressable
              className="h-8  w-8  items-center justify-center rounded-full bg-blue-800"
              onPress={() => void handlePlay(item, "UPLOAD")}
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
