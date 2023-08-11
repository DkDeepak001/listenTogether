import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { TailSpin } from "react-loader-spinner";

import { type Track } from "@acme/api/src/router/types";

import { api } from "~/utils/api";
import { getGreeting } from "~/utils/greeting";
import ArtistCard from "~/components/card/artist";
import SongCard from "~/components/card/song";
import Loader from "~/components/loader";
import Pill from "~/components/pill/pill";
import useAudio from "~/hooks/useAudio";
import useAuthToken from "../../hooks/useAuthToken";

type TopType = "tracks" | "artists";
const Home = () => {
  const router = useRouter();
  const [type, setType] = useState<TopType>("tracks");
  const { updateToken } = useAuthToken();

  const { handlePlay, isPlaying, currentTrack, isPaused } = useAudio();
  const { data: user, isLoading } = api.spotify.self.useQuery();

  const {
    data: topTracks,
    refetch: refetchTopTracks,
    isLoading: trackLoading,
  } = api.spotify.topTracks.useQuery();
  const {
    data: topArtists,
    refetch: refetchTopArtist,
    isLoading: artistLoading,
  } = api.spotify.topArtists.useQuery();

  const { mutateAsync: getNewToken } = api.user.getRefreshToken.useMutation({});

  if (topTracks?.error! || topArtists?.error!) {
    if (
      topTracks?.error?.status! === 401 ||
      topArtists?.error?.status! === 401
    ) {
      console.log(
        "Token Expired================================================",
      );
      void handleRefreshToken();
      return;
    }
  }

  async function handleRefreshToken() {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    const newToken = await getNewToken({ refresh_token: refreshToken! });

    await AsyncStorage.setItem("access_token", newToken.access_token);
  }
  if (isLoading || !user || trackLoading || artistLoading) return <Loader />;

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
            <SongCard
              item={item}
              currentTrack={currentTrack}
              handlePlay={(item: Track, type: "SPOTIFY" | "UPLOAD" | null) =>
                handlePlay(item, type)
              }
              isPaused={isPaused}
            />
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
              <ArtistCard
                id={item.id}
                name={item.name}
                image={item.images[0]?.url!}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Home;
