import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import useAccessToken from "../hooks/useAccessToken";

const Home = () => {
  const { accessToken } = useAccessToken();
  console.log(accessToken, "accessToken");

  const { data: user, isLoading } = api.spotify.getUser.useQuery({
    accessToken: accessToken ?? "",
  });
  console.log(user, "user");
  if (isLoading || !user) return <Text>Loading...</Text>;

  return (
    <View>
      <View className="mx-5 w-full ">
        <Text>{user?.display_name}</Text>
        {/* <Image
          source={{ uri: user?.images[0]?.url ?? "" }}
          className="h-20 w-20 rounded-full"
          alt="user profile image"
        /> */}
      </View>

      <Text>Home</Text>
    </View>
  );
};

export default Home;
