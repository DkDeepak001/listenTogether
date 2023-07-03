import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import useAuthToken from "../hooks/useAuthToken";

const Home = () => {
  const [type, setType] = useState<"artist" | "tracks">("tracks");
  const { authToken } = useAuthToken();
  const {
    data: user,
    isLoading,
    isError: getUserErr,
  } = api.spotify.getUser.useQuery({
    accessToken: authToken ?? "",
  });

  const { data: top, isError: topErr } = api.spotify.top.useQuery({
    type,
    accessToken: authToken ?? "",
  });
  console.log(top, "top");

  if (isLoading || !user) return <Text>Loading...</Text>;

  if (topErr || getUserErr) {
    if (topErr) console.log(topErr, "topErr");
    if (getUserErr) console.log(getUserErr, "getUserErr");
  }

  return (
    <View className="flex-1 bg-black p-5">
      <View className=" w-full ">
        <Text className="text-lg font-extrabold text-white">
          Hello {user?.display_name}
        </Text>

        <FlatList
          data={["tracks", "artist"]}
          horizontal
          className="mt-5"
          renderItem={({ item }) => (
            <Pressable
              className={`ml-2 rounded-full bg-slate-950 px-5 py-2 ${
                type === item ? "bg-slate-800" : ""
              }`}
              onPress={() => setType(item)}
            >
              <Text className="font-bold text-white">{item}</Text>
            </Pressable>
          )}
        />

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
