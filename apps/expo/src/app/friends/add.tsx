import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import SearchBar from "~/components/search/searchBar";

const Add = () => {
  const [q, setQ] = useState<string>("");
  const { data: search, isLoading } = api.friend.searchFriend.useQuery({
    username: q,
  });
  return (
    <View className="flex-1 bg-black p-5">
      <SearchBar q={q} setQ={(val) => setQ(val)} />
      <FlatList
        data={search}
        renderItem={({ item }) => (
          <View className="mt-5 flex flex-row items-center justify-between">
            <View className="flex flex-row items-center">
              <Image
                source={{ uri: item.images }}
                className="h-10 w-10 rounded-full bg-gray-400"
                alt="avatar"
              />
              <Text className="ml-3 text-lg font-semibold text-white">
                {item.display_name}
              </Text>
            </View>
            <Pressable className="flex flex-row items-center justify-center rounded-xl bg-blue-600 px-4 py-2">
              <Text className=" text-base font-semibold text-white">Add</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View className="flex flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-white">No results</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Add;
