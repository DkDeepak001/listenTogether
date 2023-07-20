import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import InputBox from "~/components/input/input";
import upload from "../../../assets/tabbar/upload.svg";
import pickImage from "../../../assets/upload/pickImage.svg";
import pickSong from "../../../assets/upload/pickSong.svg";

const Upload = () => {
  const schema = z.object({
    name: z.string().min(3).max(100),
    albumName: z.string().min(3).max(100),
    artistName: z.string().min(3).max(100),
    file: z.string().min(3).max(100).optional(),
  });
  type FormSchema = z.infer<typeof schema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const submit = (data: FormSchema) => {
    console.log(data);
  };
  return (
    <SafeAreaView className="flex-1 bg-black ">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 20,
          alignItems: "center",
        }}
      >
        {/* <View className="flex  w-11/12 flex-col items-center justify-center gap-y-5 rounded-lg bg-white/50 p-2"> */}
        <Pressable className="mb-5 flex  h-60 w-5/6 flex-col items-center justify-center gap-y-1 rounded-lg border  border-dashed border-white">
          <Image
            source={pickImage}
            className="h-16 w-16"
            contentFit="contain"
            alt="upload"
          />

          <Text className="text-xl font-bold text-white">
            Pick a Cover Image{" "}
          </Text>
        </Pressable>
        <Pressable className="flex h-28 w-5/6 flex-row items-center justify-center rounded-lg bg-blue-500">
          <Image
            source={pickSong}
            className="mr-2 h-10 w-10"
            contentFit="contain"
            alt="upload"
          />
          <Text className="text-lg font-medium text-white">
            Select a song to upload
          </Text>
        </Pressable>
        {/* </View> */}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputBox
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Song Name"
              className="mt-5"
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text className="text-red-500">{errors.name.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputBox
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Album Name"
              className="mt-5"
            />
          )}
          name="albumName"
        />
        {errors.albumName && (
          <Text className="text-red-500">{errors.albumName.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputBox
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Artist Name"
              className="mt-5"
            />
          )}
          name="artistName"
        />
        {errors.artistName && (
          <Text className="text-red-500">{errors.artistName.message}</Text>
        )}

        <Pressable
          className="mt-5  flex flex-row items-center  justify-center rounded-full bg-blue-600 px-5 py-3"
          onPress={handleSubmit(submit)}
        >
          <Image
            source={upload}
            className="mr-2 h-5 w-5"
            contentFit="contain"
            alt="upload"
          />
          <Text className="text-lg font-extrabold text-white">Upload</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upload;
