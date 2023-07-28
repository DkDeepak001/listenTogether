import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

const ChatPage = () => {
  const query = useLocalSearchParams();
  console.log(query);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `${query.name}`,
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "#fff",
    });
  }, []);

  return (
    <View className=" flex-1 flex-col bg-black p-5">
      <Text className="text-white">ChatPage</Text>
    </View>
  );
};

export default ChatPage;
