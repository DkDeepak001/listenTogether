import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { api } from "~/utils/api";
import SearchBar from "~/components/search/searchBar";

const Friends = () => {
  const [q, setQ] = useState<string>("");
  const router = useRouter();
  const { data: channel, isLoading } = api.friend.channel.useQuery({ q });
  return (
    <View className=" flex-1 flex-col bg-black p-5">
      <View className="bg-black">
        <View className="mb-6 flex w-full flex-row items-center justify-between">
          <Text className="text-2xl font-extrabold text-white">Friends</Text>
          <Pressable
            className="rounded-full bg-blue-700 px-5 py-2"
            onPress={() => router.push("/friends/add")}
          >
            <Text className="text-sm font-semibold text-white">Add</Text>
          </Pressable>
        </View>
        <SearchBar q={q} setQ={(val: string) => setQ(val)} />
      </View>
      <FlatList
        data={channel}
        keyExtractor={({ channel }) => channel.toString() ?? ""}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/friends/chat`,
                params: {
                  id: item.user?.id,
                  channel: item.channel,
                  name: item.user?.display_name,
                },
              })
            }
            className="mt-5 flex flex-row items-center justify-between border-b border-gray-700 pb-3"
          >
            <View className="flex flex-row items-center">
              <Image
                source={{ uri: item.user?.images }}
                className="h-12 w-12 rounded-full bg-gray-800"
                alt="profile"
              />
              <View className="ml-5">
                <Text className="text-sm font-semibold text-white">
                  {item.user?.display_name}
                </Text>
                <Text className="text-xs font-semibold text-gray-400">
                  {item.user?.id}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Friends;
