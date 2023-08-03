import React from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

const Playlist = () => {
  const router = useRouter();
  const { data: playlist } = api.spotify.getUserPlaylists.useQuery();

  return (
    <View className=" flex-1 bg-black p-5">
      <Text className="mb-5 text-2xl font-extrabold text-white">Playlist</Text>
      <FlatList
        data={playlist?.items}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-extrabold text-white">
              No playlist found
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <Pressable
            className="my-3 flex flex-row"
            onPress={() => router.push(`/playlist/upload`)}
          >
            <View className=" flex-1 flex-row items-center justify-between rounded-xl bg-slate-500 p-3">
              <Text className="text-3xl font-extrabold text-white">
                My uploads
              </Text>
              <Pressable className=" h-12 w-12  items-center justify-center rounded-full bg-blue-800">
                <Image
                  className="h-8 w-8 rounded-full bg-blue-800"
                  source={play}
                  alt="pause"
                />
              </Pressable>
            </View>
          </Pressable>
        )}
        renderItem={({ item }) => (
          <Pressable
            className="my-3 flex flex-row"
            onPress={() => router.push(`/playlist/${item.id}`)}
          >
            <Image
              className="h-48 w-full rounded-lg opacity-50"
              source={{ uri: item.images[0]?.url ?? "" }}
              alt={item.name}
            />
            <View className="absolute z-10 flex-1 p-3">
              <View className="flex flex-col">
                <Text className="text-3xl font-extrabold text-white">
                  {item.name}
                </Text>
                <Text className="text-lg font-semibold text-white">
                  {item.owner.display_name}
                </Text>
              </View>
            </View>
            <Pressable className="absolute bottom-2 right-2 h-12  w-12  items-center justify-center rounded-full bg-blue-800">
              <Image
                className="h-8 w-8 rounded-full bg-blue-800"
                source={play}
                alt="pause"
              />
            </Pressable>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Playlist;
