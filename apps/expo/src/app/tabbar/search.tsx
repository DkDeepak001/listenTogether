import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import Pill from "~/components/pill/pill";
import SearchBar from "~/components/search/searchBar";

export type SearchType = "tracks" | "artist" | "albums" | "playlist";

const Search = () => {
  const [type, setType] = useState<SearchType>("tracks");
  const [q, setQ] = useState<string>("");
  const { data: search, isLoading } = api.spotify.search.useQuery({
    q,
  });

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
          renderItem={({ item }) => (
            <View className="my-2 flex flex-row gap-x-5">
              <Image
                source={{
                  uri: item.album.images[0]?.url ?? "",
                }}
                className="h-20 w-20 rounded-2xl"
                alt={item?.name}
                contentFit="contain"
              />
              <View className="flex flex-col justify-center">
                <Text className="font-semibold text-white">{item?.name}</Text>
              </View>
            </View>
          )}
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
          renderItem={({ item }) => (
            <View className="my-2 flex flex-row gap-x-5">
              <Image
                source={{ uri: item.images[0]?.url ?? "" }}
                className="h-20 w-20 rounded-2xl"
                alt={item.name}
                contentFit="contain"
              />
              <View className="flex flex-col justify-center">
                <Text className="font-semibold text-white">{item.name}</Text>
              </View>
            </View>
          )}
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
          renderItem={({ item }) => (
            <View className="my-2 flex flex-row gap-x-5">
              <Image
                source={{
                  uri: item.images[0]?.url ?? "",
                }}
                className="h-20 w-20 rounded-2xl"
                alt={item.name}
                contentFit="contain"
              />
              <View className="flex flex-col justify-center">
                <Text className="font-semibold text-white">{item.name}</Text>
              </View>
            </View>
          )}
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
          renderItem={({ item }) => (
            <View className="my-2 flex flex-row gap-x-5">
              <Image
                source={{
                  uri: item.images[0]?.url ?? "",
                }}
                className="h-20 w-20 rounded-2xl"
                alt={item.name}
                contentFit="contain"
              />
              <View className="flex flex-col justify-center">
                <Text className="font-semibold text-white">{item.name}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Search;
