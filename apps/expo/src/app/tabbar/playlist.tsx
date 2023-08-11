import React from "react";
import { Button, FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";
import PlaylistCard from "~/components/card/playlist";
import Loader from "~/components/loader";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

const Playlist = () => {
  const router = useRouter();
  const { data: playlist, isLoading } = api.spotify.getUserPlaylists.useQuery();
  if (isLoading) return <Loader />;

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
            <View className=" flex-1 flex-row items-center justify-between rounded-xl bg-blue-600 p-5">
              <Text className="text-2xl font-extrabold text-white">
                My uploads
              </Text>
            </View>
          </Pressable>
        )}
        renderItem={({ item }) => (
          <PlaylistCard
            id={item.id}
            name={item.name}
            image={item?.images[0]?.url!}
            ownerName={item?.owner?.display_name!}
            key={item.id}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Playlist;
