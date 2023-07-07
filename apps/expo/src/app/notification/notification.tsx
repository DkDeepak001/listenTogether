import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";

const Notification = () => {
  const { data: notification } = api.user.notification.useQuery();

  const { mutateAsync: acceptFriend } = api.friend.acceptFriend.useMutation();

  const { mutateAsync: rejectFriend } = api.friend.rejectFriend.useMutation();

  const handleAcceptFriend = async (id: string) => {
    try {
      await acceptFriend({ friendId: id });
    } catch (e) {
      console.log(e);
    }
  };

  const handleRejectFriend = async (id: string) => {
    try {
      await rejectFriend({ friendId: id });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={notification}
        className="mt-3"
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between px-5">
            <View className="flex-row items-center gap-x-5">
              <Image
                className="h-10 w-10 rounded-full bg-gray-400"
                alt={item.requestFrom?.display_name}
                source={{ uri: item.requestFrom?.images }}
              />

              <Text className="font-base font-bold text-white">
                {item.requestFrom?.display_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-x-2">
              <Pressable
                className="rounded-lg bg-blue-800 px-4 py-2"
                onPress={() =>
                  void handleAcceptFriend(item?.requestFrom?.id ?? "")
                }
              >
                <Text className="font-xs font-bold text-white">Accept</Text>
              </Pressable>
              <Pressable
                className="rounded-lg bg-white px-4 py-2"
                onPress={() =>
                  void handleRejectFriend(item?.requestFrom?.id ?? "")
                }
              >
                <Text className="font-xs font-bold text-black">X</Text>
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <Text className="font-xs text-white">No notification</Text>
        )}
      />
    </View>
  );
};

export default Notification;
