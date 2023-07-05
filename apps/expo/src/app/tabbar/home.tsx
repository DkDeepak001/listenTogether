import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import { getGreeting } from "~/utils/greeting";
import useAuthToken from "../../hooks/useAuthToken";

type TopType = "tracks" | "artists";
const Home = () => {
  const [type, setType] = useState<TopType>("tracks");
  const { authToken, updateToken } = useAuthToken();
  const { data: user, isLoading } = api.spotify.self.useQuery();

  const { data: topTracks } = api.spotify.topTracks.useQuery();
  const { data: topArtists } = api.spotify.topArtists.useQuery();

  if (isLoading) return <Text>Loading...</Text>;

  // TODO add types to error
  if (topTracks?.error || topArtists?.error) {
    if (top?.error?.status === 401) {
      updateToken();
      refetch();
    }
  }

  return (
    <View className=" flex-1  bg-black p-5">
      <View className="flex w-full flex-col gap-y-1  ">
        <Text className="text-2xl font-extrabold text-white">
          {getGreeting()},
        </Text>
        <Text className="mb-3 text-xl font-semibold text-white">
          {user?.display_name?.charAt(0).toUpperCase() +
            user?.display_name?.slice(1).toLowerCase()}
          {" ✨"}
        </Text>
        <View className="my-3">
          <FlatList
            data={["tracks", "artists"]}
            horizontal
            renderItem={({ item }) => (
              <Pressable
                className={`mr-2 rounded-full bg-gray-800 px-5 py-2 ${
                  type === item ? "bg-blue-700" : ""
                }`}
                onPress={() => setType(item as TopType)}
              >
                <Text className="text-sm font-semibold  text-white">
                  {item[0] && item[0].toUpperCase() + item.slice(1)}
                </Text>
              </Pressable>
            )}
          />
        </View>
        {type === "tracks" && (
          <FlatList
            data={topTracks?.items ?? []}
            className="mb-16 "
            ListHeaderComponent={() => (
              <Text className="mb-3 text-xl font-extrabold text-white">
                Top Tracks
              </Text>
            )}
            ListEmptyComponent={() => (
              <Text className="text-white">No tracks found</Text>
            )}
            renderItem={({ item }) => (
              <View className="my-2 flex flex-row gap-x-5">
                <Image
                  source={{ uri: item.album.images[0]?.url }}
                  className="h-20 w-20 rounded-2xl"
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
            )}
          />
        )}
        {type === "artists" && (
          <FlatList
            data={topArtists?.items ?? []}
            className="mb-16 "
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: "2%",
            }}
            numColumns={2}
            ListHeaderComponent={() => (
              <Text className="mb-3 text-xl font-extrabold text-white">
                Top Artists
              </Text>
            )}
            ListEmptyComponent={() => (
              <Text className="text-white">No artists found</Text>
            )}
            renderItem={({ item }) => {
              return (
                <View className="my-2 mb-5 flex w-[48%] flex-col items-center gap-y-2">
                  <Image
                    source={{ uri: (item?.images[0]?.url as string) ?? "" }}
                    className="h-24 w-full rounded-2xl"
                    contentFit="cover"
                    alt={item.name}
                  />
                  <View className="flex flex-col justify-center">
                    <Text className=" Stext-lg font-extrabold text-white">
                      {item.name}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Home;
