import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  type PusherEvent,
  type PusherMember,
} from "@pusher/pusher-websocket-react-native";

import { api } from "~/utils/api";
import pusher from "~/utils/pusher";

// import pusherClient from "~/utils/pusher";

const ChatPage = () => {
  const query = useLocalSearchParams();
  const navigation = useNavigation();

  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Array<string>>([]);

  const { mutateAsync: sendMessage } = api.channel.sendMessage.useMutation();
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
    const PusherInit = async () => {
      try {
        await pusher.subscribe({
          channelName: `public-${query?.channel}`,
          onEvent: (event: PusherEvent) => {
            console.log(`Event received: ${event}`);
            if (event.eventName === "message") {
              setMessages((prev) => [...prev, event.data as string]);
            }
          },
          onSubscriptionSucceeded: (members: PusherMember[]) => {
            console.log(`Subscription succeeded: ${JSON.stringify(members)}`);
          },
          onMemberAdded(member) {
            console.log(`Member added: ${JSON.stringify(member)}`);
          },
          onMemberRemoved(member) {
            console.log(`Member removed: ${JSON.stringify(member)}`);
          },
          onSubscriptionError: (status) => {
            console.log(`Error: ${JSON.stringify(status)}`);
          },
        });
      } catch (e) {
        console.log(`ERROR: ${e}`);
      }
    };

    PusherInit();

    return async () => {
      // Clean up function: Unsubscribe and disconnect Pusher channel
      console.log("Unsubscribing and disconnecting Pusher channel");
      if (pusher) {
        await pusher.unsubscribe({
          channelName: `public-${query?.channel}`,
        });
      }
    };
  }, []);

  const handleSentMessage = async () => {
    try {
      const response = await sendMessage({
        channelId: `${query?.channel}`,
        message: messageText,
        event: "message",
      });
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className=" flex flex-1 flex-col items-center justify-center bg-black p-5">
      <Text className="text-white">ChatPage</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text className="text-white">{item}</Text>}
        keyExtractor={(item) => item}
      />

      <Pressable
        onPress={() => handleSentMessage()}
        className="rounded-md bg-blue-500 p-5"
      >
        <Text className="text-white">Send Message</Text>
      </Pressable>
      <TextInput
        className="mt-5 w-full rounded-lg bg-gray-500 px-2 py-2 text-white"
        value={messageText}
        onChangeText={(text) => setMessageText(text)}
      />
    </View>
  );
};

export default ChatPage;
