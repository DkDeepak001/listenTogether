import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";

const Notification = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: notification } = api.user.notification.useQuery();

  const context = api.useContext();

  const { mutateAsync: acceptFriend } = api.friend.acceptFriend.useMutation({
    onMutate: async (variable) => {
      await context.user.notification.cancel();
      await context.friend.searchFriend.cancel();

      const prev = context.user.notification.getData();

      const self = context.spotify.self.getData();
      const hasFollowing = self?.following?.some(
        (u) => u?.followersId === variable?.friendId,
      );

      context.user.notification.setData(void {}, (old) => {
        if (!old) return;
        const notification = old?.find((u) => u.id === selectedId);
        if (!notification) return;

        return old.map((u) => {
          if (u?.id === selectedId) {
            return {
              ...u,
              status: hasFollowing ? "following" : "not following",
            };
          }
          return u;
        });
      });
      return { prev };
    },
    onError: (err, _, ctx) => {
      if (ctx) {
        context.user.notification.setData(void {}, ctx?.prev);
      }
      console.log(err);
    },
    onSettled: () => {
      void context.user.notification.cancel();
      void context.user.notification.invalidate();
      void context.spotify.self.invalidate();
      void context.friend.invalidate();
    },
  });

  const { mutateAsync: rejectFriend } = api.friend.rejectFriend.useMutation({
    onMutate: async () => {
      await context.user.notification.cancel();
      await context.friend.searchFriend.cancel();

      const prev = context.user.notification.getData();

      context.user.notification.setData(void {}, (old) => {
        if (!old) return;
        const notification = old?.find((u) => u.id === selectedId);
        if (!notification) return;

        return old.filter((u) => u?.id !== selectedId);
      });
      return { prev };
    },
    onError: (err, _, ctx) => {
      if (ctx) {
        context.user.notification.setData(void {}, ctx?.prev);
      }
      console.log(err);
    },
    onSettled: () => {
      void context.user.notification.cancel();
      void context.user.notification.invalidate();
    },
  });

  const { mutateAsync: followBack } = api.friend.addFriend.useMutation({
    onMutate: async () => {
      await context.user.notification.cancel();
      await context.friend.searchFriend.cancel();

      const prev = context.user.notification.getData();

      context.user.notification.setData(void {}, (old) => {
        if (!old) return;
        const notification = old?.find((u) => u.id === selectedId);
        if (!notification) return;

        return old.map((u) => {
          if (u?.id === selectedId) {
            return { ...u, status: "requested" };
          }
          return u;
        });
      });
      return { prev };
    },
    onError: (err, _, ctx) => {
      if (ctx) {
        context.user.notification.setData(void {}, ctx?.prev);
      }
      console.log(err);
    },
    onSettled: () => {
      void context.user.notification.cancel();
      void context.user.notification.invalidate();
      void context.spotify.self.invalidate();
    },
  });

  const handleAcceptFriend = async (id: string, dataId: string) => {
    setSelectedId(dataId);
    try {
      await acceptFriend({ friendId: id });
    } catch (e) {
      console.log(e);
    }
  };

  const handleRejectFriend = async (id: string, dataId: string) => {
    setSelectedId(dataId);
    try {
      await rejectFriend({ friendId: id });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFollowBack = async (id: string, dataId: string) => {
    setSelectedId(dataId);

    try {
      await followBack({ friendId: id });
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
                  item.status === "pending"
                    ? void handleAcceptFriend(
                        item?.requestFrom?.id ?? "",
                        item?.id ?? "",
                      )
                    : item.status === "not following"
                    ? void handleFollowBack(
                        item?.requestFrom?.id ?? "",
                        item?.id ?? "",
                      )
                    : void handleRejectFriend(
                        item?.requestFrom?.id ?? "",
                        item?.id ?? "",
                      )
                }
              >
                <Text className="font-xs font-bold text-white">
                  {item.status === "pending" && `Accept`}
                  {item.status === "following" && `un follow`}
                  {item.status === "not following" && `follow back`}
                  {item.status === "requested" && `Cancel`}
                </Text>
              </Pressable>
              {item.status === "pending" && (
                <Pressable
                  className="rounded-lg bg-white px-4 py-2"
                  onPress={() =>
                    void handleRejectFriend(
                      item?.requestFrom?.id ?? "",
                      item?.id ?? "",
                    )
                  }
                >
                  <Text className="font-xs font-bold text-black">X</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <Text className="font-xs text-center text-white">
            No notification
          </Text>
        )}
      />
    </View>
  );
};

export default Notification;
