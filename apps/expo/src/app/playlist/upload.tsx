import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import useAudio from "~/hooks/useAudio";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

const UploadedSong = () => {
  const { data: myUploads } = api.upload.get.useQuery();

  const {
    currentDuration,
    currentSound,
    currentTrack,
    handlePlay,
    isPlaying,
    isPaused,
    pauseSong,
    handleNextSong,
  } = useAudio();

  return (
    <View className="max-h-full min-h-screen bg-black p-2">
      <FlatList
        data={myUploads}
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
              className="  h-8  w-8  items-center justify-center rounded-full bg-blue-800"
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
      />
    </View>
  );
};

export default UploadedSong;
