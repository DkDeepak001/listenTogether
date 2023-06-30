import React from "react";
import { Text, View } from "react-native";

import { api } from "~/utils/api";

const Home = () => {
  const { data: getPlaylist } = api.spotify.getPlaylist.useQuery({
    accessToken:
      "BQBSbX7uisiCLq2OGfgtSbTEnfEeDKLXy_gsDjuFJ7uJ0NBKpGg2W_xMa7jM6ulHFU1og_2-37WEcab0S0OhaYmXAnC-MEnWPiohJn6v7nHNbxY77ocuQkHMeVs5emPl1m8cmMCiDPEHq0vIQIE4OrTUVlG0nZbypYi4xyI23GmDnDezbGkvmArjlvSBskykrQhzEJpesgNXXU4",
  });
  console.log(getPlaylist);
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
