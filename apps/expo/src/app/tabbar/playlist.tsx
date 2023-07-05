import React from "react";
import { Text, View } from "react-native";

import { api } from "~/utils/api";

const Playlist = () => {
  const { data: playlist } = api.spotify.getUserPlaylists.useQuery();
  return (
    <View className=" flex-1 bg-black p-5">
      <Text className="text-2xl font-extrabold text-white">Playlist</Text>
    </View>
  );
};

export default Playlist;
