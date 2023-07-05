import React from "react";
import { FlatList, Pressable, Text } from "react-native";
import { type FlatListProps } from "react-native/Libraries/Lists/FlatList";

type PillProps = Omit<FlatListProps<string>, "renderItem"> & {
  data: Array<string>;
  set: (item: string) => void;
  selected: string;
};

const Pill = ({ data, selected, set, ...props }: PillProps) => {
  return (
    <FlatList
      {...props}
      data={data}
      renderItem={({ item }) => (
        <Pressable
          className={`mr-2 flex h-7 items-center justify-center rounded-full bg-gray-800 px-5 ${
            selected === item ? "bg-blue-700" : ""
          }`}
          onPress={() => set(item)}
        >
          <Text className="text-sm font-semibold  text-white">
            {item[0] && item[0].toUpperCase() + item.slice(1)}
          </Text>
        </Pressable>
      )}
    />
  );
};

export default Pill;
