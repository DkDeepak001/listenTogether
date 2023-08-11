import React from "react";
import { FlatList, Text, View } from "react-native";

import { type Track } from "@acme/api/src/router/types";

import { api } from "~/utils/api";
import SongCard from "~/components/card/song";
import useAudio from "~/hooks/useAudio";

const UploadedSong = () => {
  const { data: myUploads } = api.upload.get.useQuery();

  const { currentTrack, handlePlay, isPaused } = useAudio();

  return (
    <View className="max-h-full min-h-screen bg-black p-2">
      <FlatList
        data={myUploads}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl font-extrabold text-white">
              No song found
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SongCard
            item={item}
            currentTrack={currentTrack}
            handlePlay={(item: Track, type: "SPOTIFY" | "UPLOAD" | null) =>
              handlePlay(item, type)
            }
            isPaused={isPaused}
          />
        )}
      />
    </View>
  );
};

export default UploadedSong;
