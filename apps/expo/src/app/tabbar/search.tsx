import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";
import Pill from "~/components/pill/pill";
import SearchBar from "~/components/search/searchBar";
import useAudio from "~/hooks/useAudio";
import pause from "../../../assets/playlist/pause.svg";
import play from "../../../assets/playlist/play.svg";

export type SearchType = "tracks" | "artist" | "albums" | "playlist";

const Search = () => {
  const router = useRouter();
  const [type, setType] = useState<SearchType>("tracks");
  const [q, setQ] = useState<string>("");
  const { data: search, isLoading } = api.spotify.search.useQuery({
    q,
  });
  const { currentTrack, handlePlay, isPlaying } = useAudio();

  return (
    <View className=" flex-1 bg-black p-4">
      <SearchBar q={q} setQ={(val) => setQ(val)} />
      <View className="my-3">
        <Pill
          className=" "
          horizontal
          data={["tracks", "artist", "albums", "playlist"]}
          selected={type}
          set={(val) => setType(val as SearchType)}
        />
      </View>
      {isLoading && (
        <Text className="text-white">
          Searching for {q} in {type}
        </Text>
      )}

      {!q && (
        <Text className="text-white">
          Search for your favorite tracks, artists, albums
        </Text>
      )}

      {q && type === "tracks" && (
        <FlatList
          data={search?.tracks?.items ?? []}
          ListHeaderComponent={() => (
            <Text className="mb-3 text-xl font-extrabold text-white">
              Top Tracks
            </Text>
          )}
          ListEmptyComponent={() => (
            <Text className="text-white">No tracks found</Text>
          )}
          renderItem={({ item }) => {
            if (!item?.album) return <></>;
            return (
              <View className="my-2 flex flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-x-2">
                  <Image
                    source={{
                      uri: item.album.images[0]?.url ?? "",
                    }}
                    className="h-20 w-20 rounded-2xl"
                    alt={item?.name}
                    contentFit="contain"
                  />
                  <View className="flex flex-col justify-center">
                    <Text className="font-semibold text-white">
                      {item?.name}
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
            );
          }}
        />
      )}

      {q && type === "artist" && (
        <FlatList
          data={search?.artists?.items ?? []}
          ListHeaderComponent={() => (
            <Text className="mb-3 text-xl font-extrabold text-white">
              Top Artists
            </Text>
          )}
          ListEmptyComponent={() => (
            <Text className="text-white">No artists found</Text>
          )}
          renderItem={({ item }) => {
            if (!item?.images) return <></>;
            return (
              <Pressable
                className="my-2 flex flex-row gap-x-5"
                onPress={() => router.push(`/artist/${item.id}`)}
              >
                <Image
                  source={{ uri: item.images[0]?.url ?? "" }}
                  className="h-20 w-20 rounded-2xl"
                  alt={item.name}
                  contentFit="contain"
                />
                <View className="flex flex-col justify-center">
                  <Text className="font-semibold text-white">{item.name}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {q && type === "albums" && (
        <FlatList
          data={search?.albums.items ?? []}
          ListHeaderComponent={() => (
            <Text className="mb-3 text-xl font-extrabold text-white">
              Top Albums
            </Text>
          )}
          ListEmptyComponent={() => (
            <Text className="text-white">No albums found</Text>
          )}
          renderItem={({ item }) => {
            if (!item?.images) return <></>;
            return (
              <Pressable
                className="my-2 flex flex-row gap-x-5"
                onPress={() => router.push(`/album/${item.id}`)}
              >
                <Image
                  source={{ uri: item.images[0]?.url ?? "" }}
                  className="h-20 w-20 rounded-2xl"
                  alt={item.name}
                  contentFit="contain"
                />
                <View className="flex flex-col justify-center">
                  <Text className="font-semibold text-white">{item.name}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {q && type === "playlist" && (
        <FlatList
          data={search?.playlists?.items ?? []}
          ListHeaderComponent={() => (
            <Text className="mb-3 text-xl font-extrabold text-white">
              Top Playlists
            </Text>
          )}
          ListEmptyComponent={() => (
            <Text className="text-white">No playlists found</Text>
          )}
          renderItem={({ item }) => {
            if (!item?.images) return <></>;
            return (
              <Pressable
                className="my-2 flex flex-row gap-x-5"
                onPress={() => router.push(`/playlist/${item.id}`)}
              >
                <Image
                  source={{ uri: item.images[0]?.url ?? "" }}
                  className="h-20 w-20 rounded-2xl"
                  alt={item.name}
                  contentFit="contain"
                />
                <View className="flex flex-col justify-center">
                  <Text className="font-semibold text-white">{item.name}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

export default Search;
