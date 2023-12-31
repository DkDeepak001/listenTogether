import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import SearchBar from "~/components/search/searchBar";

const Add = () => {
  const [q, setQ] = useState<string>("");
  const { data: search } = api.friend.searchFriend.useQuery({
    username: q,
  });
  console.log(search);
  const context = api.useContext();
  const { mutateAsync: addFriend } = api.friend.addFriend.useMutation({
    onMutate: async (variable) => {
      await context.friend.searchFriend.cancel();
      const previousFriends = context.friend.searchFriend.getData({
        username: q,
      });
      context.friend.searchFriend.setData({ username: q }, (old) => {
        if (!old) return;
        const user = old?.find((u) => u.id === variable.friendId);
        if (!user) return;

        return old.map((u) => {
          if (u?.id === variable.friendId) {
            return { ...u, isReqestSent: true };
          }
          return u;
        });
      });
      return { previousFriends };
    },

    onError: (err, _, ctx) => {
      if (ctx) {
        context.friend.searchFriend.setData(
          { username: q },
          ctx?.previousFriends,
        );
      }
      console.log(err);
    },
    onSettled: () => {
      void context.friend.searchFriend.cancel();
      void context.friend.searchFriend.invalidate({ username: q });
    },
  });
  const { mutateAsync: cancelFriend } =
    api.friend.cancelFriendRequest.useMutation({
      onMutate: async (variable) => {
        await context.friend.searchFriend.cancel();
        const previousFriends = context.friend.searchFriend.getData({
          username: q,
        });
        context.friend.searchFriend.setData({ username: q }, (old) => {
          if (!old) return;
          const user = old?.find((u) => u.id === variable.friendId);
          if (!user) return;

          return old.map((u) => {
            if (u?.id === variable.friendId) {
              return { ...u, isReqestSent: false };
            }
            return u;
          });
        });
        return { previousFriends };
      },
      onError: (err, _, ctx) => {
        if (ctx) {
          context.friend.searchFriend.setData(
            { username: q },
            ctx?.previousFriends,
          );
        }
        console.log(err);
      },
      onSettled: () => {
        void context.friend.searchFriend.cancel();
        void context.friend.searchFriend.invalidate({ username: q });
      },
    });

  const handleFriendRequest = async (id: string) => {
    try {
      console.log(id, "add");
      await addFriend({ friendId: id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelFriendRequest = async (id: string) => {
    try {
      console.log(id, "cancel");
      await cancelFriend({ friendId: id });
    } catch (error) {
      console.log(error);
    }
  };

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
            {!item.isFollowing && (
              <Pressable
                className="flex flex-row items-center justify-center rounded-xl bg-blue-600 px-4 py-2"
                onPress={() => {
                  item.isReqestSent
                    ? void handleCancelFriendRequest(item.id)
                    : void handleFriendRequest(item.id);
                }}
              >
                <Text className=" text-base font-semibold text-white">
                  {item.isReqestSent ? "Cancel" : "Add"}
                </Text>
              </Pressable>
            )}
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
