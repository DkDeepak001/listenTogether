import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Image } from "expo-image";

import { api } from "~/utils/api";
import Pill from "~/components/pill/pill";

export type SearchType = "tracks" | "artist" | "album";

const Search = () => {
  const [type, setType] = useState<SearchType>("tracks");
  const { data: search } = api.spotify.search.useQuery({
    q: "eminem",
    type: "artist",
  });
  console.log(search);
  return (
    <View className=" flex-1  bg-black p-5">
      <View className="flex w-full flex-row items-center rounded-full  bg-gray-800">
        <Image
          source={require("../../../assets/tabbar/search.svg")}
          className={"ml-2 h-8 w-10"}
          contentFit="contain"
          alt="search"
        />

        <TextInput
          className="-ml-5 w-3/4 px-5 py-2 font-semibold text-white"
          placeholder="Search"
          placeholderTextColor="white"
        />
      </View>
      <Pill
        data={["album", "tracks", "artist"]}
        selected={type}
        set={(val) => setType(val as SearchType)}
      />
    </View>
  );
};

export default Search;
