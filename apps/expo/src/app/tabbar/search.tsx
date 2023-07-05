import React, { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import Pill from "~/components/pill/pill";

export type SearchType = "tracks" | "artist" | "albums" | "playlist";

const Search = () => {
  const [type, setType] = useState<SearchType>("tracks");
  const [q, setQ] = useState<string>("");
  const { data: search, isLoading } = api.spotify.search.useQuery({
    q,
  });
  return (
    <View className=" flex-1 bg-black p-4">
      <View className="flex w-full flex-row items-center rounded-full  bg-gray-800">
        <Image
          source={require("../../../assets/tabbar/search.svg")}
          className={"ml-2 h-8 w-10"}
          contentFit="contain"
          alt="search"
        />

        <TextInput
          className="-ml-5 w-3/4 px-5 py-2 font-semibold text-white"
          placeholder="Search"
          placeholderTextColor="white"
          onChangeText={(text) => setQ(text)}
          value={q}
        />
      </View>
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
