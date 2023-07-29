import React, { useEffect, useLayoutEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { api } from "~/utils/api";
import pusherClient from "~/utils/pusher";

const ChatPage = () => {
  const query = useLocalSearchParams();
  const navigation = useNavigation();

  const { mutateAsync: sendMessage } = api.channel.trigger.useMutation();
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

  useEffect(() => {
    const chanel = pusherClient.subscribe({
      channelName: `private-${query?.channel}`,
      onEvent: (event) => {
        console.log("event subscribe", event);
      },
    });

    chanel.bind(`connected`, () => {
      console.log("event Bind", event);
    });

    return () => {
      pusherClient
        .unsubscribe({
          channelName: `private-${query?.channel}`,
        })
        .then(() => {
          console.log("Unsubscribed successfully");
        })
        .catch((e) => {
          console.log("Error unsubscribing: ", e);
        });
    };
  }, []);

  const handleSentMessage = async () => {
    console.log("handleSentMessage");
    try {
      const response = await sendMessage({
        channelId: `private-${query?.channel}`,
        message: "Hello world",
      });
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className=" flex flex-1 flex-col items-center justify-center bg-black p-5">
      <Text className="text-white">ChatPage</Text>
      <Pressable
        onPress={() => handleSentMessage()}
        className="rounded-md bg-blue-500 p-5"
      >
        <Text className="text-white">Send Message</Text>
      </Pressable>
    </View>
  );
};

export default ChatPage;
