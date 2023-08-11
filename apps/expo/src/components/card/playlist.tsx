import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

type PlaylistCardProps = {
  id: string;
  name: string;
  image: string;
  ownerName: string;
};

const PlaylistCard = ({ id, image, name, ownerName }: PlaylistCardProps) => {
  const router = useRouter();
  return (
    <Pressable
      className="my-3 flex flex-row"
      onPress={() => router.push(`/playlist/${id}`)}
    >
      <Image
        className="h-48 w-full rounded-lg opacity-50"
        source={{ uri: image }}
        alt={name}
      />
      <View className="absolute z-10 flex-1 p-3">
        <View className="flex flex-col">
          <Text className="text-3xl font-extrabold text-white">{name}</Text>
          <Text className="text-lg font-semibold text-white">{ownerName}</Text>
        </View>
      </View>
      {/* <Pressable className="absolute bottom-2 right-2 h-12  w-12  items-center justify-center rounded-full bg-blue-800">
              <Image
                className="h-8 w-8 rounded-full bg-blue-800"
                source={play}
                alt="pause"
              />
            </Pressable> */}
    </Pressable>
  );
};

export default PlaylistCard;
