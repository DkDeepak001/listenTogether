import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import InputBox from "~/components/input/input";
import upload from "../../../assets/tabbar/upload.svg";
import pickImage from "../../../assets/upload/pickImage.svg";
import pickSong from "../../../assets/upload/pickSong.svg";

type FormSchema = {
  name: string;
  albumName: string;
  artistName: string;
  image: ImagePicker.ImagePickerResult | null;
  audio: MediaLibrary.Asset | null;
};
const Upload = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [audio, setAudio] =
    useState<MediaLibrary.PagedInfo<MediaLibrary.Asset> | null>(null);

  const [show, setShow] = useState<boolean>(false);
  const schema = z.object({
    name: z.string().min(3).max(100),
    albumName: z.string().min(3).max(100),
    artistName: z.string().min(3).max(100),
    image: z.custom((value) => {
      if (!value) {
        return "Image is required";
      }
      return true;
    }),
    audio: z.custom((value) => {
      if (!value) {
        return "Audio is required";
      }
      return true;
    }),
  });
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const submit = (data: FormSchema) => {
    console.log(data);
  };

  useEffect(() => {
    watch("image");
    watch("audio");
  }, [watch]);

  const openGallery = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setValue("image", result);
    }
  };

  const openFile = async () => {
    if (!audio) {
      if (!permissionResponse?.granted) {
        await requestPermission();
      } else {
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
        });
        console.log(result);
        setAudio(result);
      }
    }
    setShow(true);
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
        <Pressable
          onPress={openGallery}
          className="flex h-60  w-5/6  items-center justify-center overflow-hidden rounded-lg  border border-dashed border-white"
        >
          {!getValues("image") ? (
            <View className="h-full flex-col items-center justify-center gap-y-1">
              <Image
                source={pickImage}
                className="h-16 w-16"
                contentFit="contain"
                alt="upload"
              />

              <Text className="text-xl font-bold text-white">
                Pick a Cover Image{" "}
              </Text>
            </View>
          ) : (
            <Image
              source={getValues("image.assets.0.uri")}
              className="h-full w-full object-cover"
              contentFit="cover"
              alt="upload"
            />
          )}
        </Pressable>
        {errors.image && (
          <Text className="pt-3 text-red-500">{errors.image.message}</Text>
        )}
        <Pressable
          onPress={openFile}
          className="mt-5 flex h-28 w-5/6 flex-row items-center justify-center rounded-lg bg-blue-500"
        >
          <Image
            source={pickSong}
            className="mr-2 h-10 w-10"
            contentFit="contain"
            alt="upload"
          />
          <Text
            className={`${
              getValues("audio") &&
              `w-3/5
              `
            }  text-lg font-medium text-white`}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {!getValues("audio")
              ? `Select a song to upload`
              : getValues("audio.filename")}
          </Text>
        </Pressable>
        {errors.audio && (
          <Text className="pt-3 text-red-500">{errors.audio.message}</Text>
        )}
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
          <Text className="pt-3 text-red-500">{errors.name.message}</Text>
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
          <Text className="pt-3 text-red-500">{errors.albumName.message}</Text>
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
          <Text className="pt-3 text-red-500">{errors.artistName.message}</Text>
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
      <Modal
        visible={show}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShow(false);
        }}
      >
        <Pressable
          onPress={() => setShow(false)}
          className="flex-1 items-center justify-end bg-black/50"
        >
          <View className="relative bottom-0 z-50 h-3/5 bg-gray-500 pt-5">
            <FlatList
              data={audio?.assets}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setValue("audio", item);
                    setShow(false);
                  }}
                  className="flex flex-row items-center justify-between rounded-lg  px-5 py-3"
                >
                  <Text
                    className="w-full text-lg font-medium text-white"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {item?.filename}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Upload;
