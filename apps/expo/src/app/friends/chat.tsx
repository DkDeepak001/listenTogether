import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import send from " ../../../assets/send.svg";
import {
  type PusherEvent,
  type PusherMember,
} from "@pusher/pusher-websocket-react-native";

import { api } from "~/utils/api";
import pusher from "~/utils/pusher";
import useAudio from "~/hooks/useAudio";
import { useAudioStore } from "~/store/audio";

// import pusherClient from "~/utils/pusher";

const ChatPage = () => {
  const query = useLocalSearchParams();
  const navigation = useNavigation();

  const [messageText, setMessageText] = useState<string>("");
  const { setLiveSong } = useAudio();

  const { isPlaying, currentSound, currentTrack } = useAudioStore();

  const [listeningSong, setListeningSong] = useState<string>("");

  const context = api.useContext();
  const user = context.spotify.self.getData();
  const { data: allMessage } = api.channel.allMessages.useQuery({
    channelId: query.channel as string,
  });

  const { mutateAsync: sendListening } =
    api.channel.sendListening.useMutation();
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
            if (event.eventName === "listening") {
              const song = JSON.parse(event?.data);
              setListeningSong(song.currentTrack.name ?? "");
              if (!isPlaying) {
                console.log(
                  "Load song______________________________________________________________",
                );
                setLiveSong(song);
              }
            }
            if (event.eventName === "message") {
              console.log("message recived", event.data);
              context.channel.allMessages.setData(
                { channelId: query.channel as string },
                (old) => {
                  return {
                    ...old,
                    chatMessage: [
                      ...old?.chatMessage,
                      {
                        id: "temp",
                        message: event.data,
                        sender: {
                          display_name: query.name,
                          id: user?.id,
                        },
                      },
                    ],
                  };
                },
              );
              context.channel.allMessages.invalidate();
            }
          },

          onSubscriptionSucceeded: async (members: PusherMember) => {
            const sound = await currentSound?.getStatusAsync();

            await sendListening({
              channelId: `${query?.channel}`,
              isListening: isPlaying,
              currentTrack: currentTrack ?? "",
              currentSound: sound ?? "",
            });
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
    setMessageText("");
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
      <Text className="text-white">ChatPage {listeningSong}</Text>
      <FlatList
        data={allMessage?.chatMessage}
        renderItem={({ item }) => (
          <View className={`mb-2 flex w-full flex-row `}>
            <Text
              className={`w-full  ${
                item.sender.id === user?.id ? "text-right" : "text-left"
              } text-white`}
            >
              {item.message}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View className="flex w-full flex-row items-center rounded-3xl bg-gray-200">
        <TextInput
          className="w-9/12 rounded-lg px-6  text-white"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          placeholder="Type your message here"
          placeholderTextColor="white"
        />
        <Pressable
          onPress={() => handleSentMessage()}
          className="flex w-1/4 flex-row  justify-end self-end rounded-md  p-5"
        >
          <Image source={send} className="h-5 w-6" />
          {/* <Text className="text-white">Send Message</Text> */}
        </Pressable>
      </View>
    </View>
  );
};

export default ChatPage;
