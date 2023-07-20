import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import InputBox from "~/components/input/input";
import upload from "../../../assets/tabbar/upload.svg";

const Upload = () => {
  const [songName, setSongName] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [albumName, setAlbumName] = useState<string>("");

  return (
    <View className="flex-1 items-center bg-black pt-10">
      <Pressable className="flex h-64 w-64 flex-col items-center justify-center gap-y-5 rounded-lg border border-white">
        <Image
          source={upload}
          className="h-20 w-20"
          contentFit="contain"
          alt="upload"
        />

        <Text className="text-2xl font-extrabold text-white">Upload</Text>
      </Pressable>
    </View>
  );
};

export default Upload;
