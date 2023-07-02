import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import useAuthToken from "../hooks/useAuthToken";

const Home = () => {
  const { authToken, refreshToken } = useAuthToken();
  console.log(authToken, "authToken");
  const { data: user, isLoading } = api.spotify.getUser.useQuery({
    accessToken: authToken ?? "",
  });
  console.log(user, "user");
  if (isLoading || !user) return <Text>Loading...</Text>;

  return (
    <View className="flex-1 bg-gray-800">
      <View className="mx-5 w-full ">
        <Text>{user?.display_name}</Text>
        {/* <Image
          source={{ uri: user.images ?? "" }}
          className="h-20 w-20 rounded-full"
          alt="user profile image"
        /> */}
      </View>

      <Text>Home</Text>
    </View>
  );
};

export default Home;
