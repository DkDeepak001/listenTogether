import React from "react";
import { Text, TextInput, View } from "react-native";
import { Image } from "expo-image";

type SearchBarProps = {
  q: string;
  setQ: (q: string) => void;
  globalClassName?: string;
  inputClassName?: string;
};

const SearchBar = ({
  q,
  setQ,
  globalClassName,
  inputClassName,
}: SearchBarProps) => {
  return (
    <View
      className={`flex w-full flex-row items-center rounded-full  bg-gray-800 ${globalClassName}`}
    >
      <Image
        source={require("../../../assets/tabbar/search.svg")}
        className={"ml-2 h-8 w-10"}
        contentFit="contain"
        alt="search"
      />

      <TextInput
        className={`-ml-5 w-3/4 px-5 py-2 font-semibold text-white ${inputClassName}`}
        placeholder="Search"
        placeholderTextColor="white"
        onChangeText={(text) => setQ(text)}
        value={q}
      />
    </View>
  );
};

export default SearchBar;
