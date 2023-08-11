import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

type ArtistCardProps = {
  image: string;
  name: string;
  id: string;
};

const ArtistCard = ({ id, image, name }: ArtistCardProps) => {
  const router = useRouter();
  return (
    <Pressable
      className="my-2 mb-5 flex w-[48%] flex-col items-center gap-y-2"
      onPress={() => router.push(`/artist/${id}`)}
    >
      <Image
        source={{ uri: image }}
        className="h-24 w-full rounded-2xl"
        contentFit="cover"
        alt={name}
      />
      <View className="flex flex-col justify-center">
        <Text className=" Stext-lg font-extrabold text-white">{name}</Text>
      </View>
    </Pressable>
  );
};

export default ArtistCard;
