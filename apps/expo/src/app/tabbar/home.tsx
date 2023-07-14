import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";
import { getGreeting } from "~/utils/greeting";
import Pill from "~/components/pill/pill";
import useAudio from "~/hooks/useAudio";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";
import useAuthToken from "../../hooks/useAuthToken";

type TopType = "tracks" | "artists";
const Home = () => {
  const router = useRouter();
  const [type, setType] = useState<TopType>("tracks");
  const { updateToken } = useAuthToken();
  const { handlePlay, isPlaying, currentTrack } = useAudio();
  const { data: user, isLoading } = api.spotify.self.useQuery();

  const { data: topTracks, refetch: refetchTopTracks } =
    api.spotify.topTracks.useQuery();
  const { data: topArtists, refetch: refetchTopArtist } =
    api.spotify.topArtists.useQuery();

  if (isLoading || !user) return <Text>Loading...</Text>;

  // TODO add types to error
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (topTracks?.error || topArtists?.error) {
    console.log(topTracks, topArtists);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (topTracks?.error?.status === 401) {
      updateToken();
      refetchTopArtist();
      refetchTopTracks();
    }
  }

  return (
    <View className=" flex-1  bg-black px-5 pt-5">
      <View className=" mr-10 flex flex-row items-center justify-between">
        <View className="flex w-full flex-col gap-y-1">
          <Text className="text-2xl font-extrabold text-white">
            {getGreeting()},
          </Text>
          <Text className="mb-3 text-xl font-semibold text-white">
            {user?.display_name?.charAt(0).toUpperCase() +
              user?.display_name?.slice(1).toLowerCase()}
            {" ✨"}
          </Text>
        </View>
        <Pressable
          className="rounded-full  p-3"
          onPress={() => router.push("/notification/notification")}
        >
          <Image
            source={require("../../../assets/notification.svg")}
            className="h-6 w-6"
            alt="notification"
          />
        </Pressable>
      </View>
      <View className="my-3">
        <Pill
          data={["tracks", "artists"]}
          horizontal
          selected={type}
          set={(val) => setType(val as TopType)}
        />
      </View>
      {type === "tracks" && (
        <FlatList
          data={topTracks?.items ?? []}
          ListHeaderComponent={() => (
            <Text className="mb-3 text-xl font-extrabold text-white">
              Top Tracks
            </Text>
          )}
          ListEmptyComponent={() => (
            <Text className="text-white">No tracks found</Text>
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
                onPress={() => void handlePlay(item)}
              >
                <Image
                  className="h-4 w-4 rounded-full bg-blue-800"
                  source={currentTrack === item && isPlaying ? pause : play}
                  alt="pause"
                />
              </Pressable>
            </View>
          )}
        />
      )}
      {type === "artists" && (
        <FlatList
          data={topArtists?.items ?? []}
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
              <Pressable
                className="my-2 mb-5 flex w-[48%] flex-col items-center gap-y-2"
                onPress={() => router.push(`/artist/${item.id}`)}
              >
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
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

export default Home;
