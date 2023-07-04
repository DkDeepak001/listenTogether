import React from "react";
import { Pressable, Text, View } from "react-native";

const Friends = () => {
  return (
    <View className=" flex-1 bg-black p-5">
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="text-2xl font-extrabold text-white">Friends</Text>
        <Pressable className="rounded-full bg-blue-700 px-5 py-2">
          <Text className="text-sm font-semibold text-white">Add</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Friends;
