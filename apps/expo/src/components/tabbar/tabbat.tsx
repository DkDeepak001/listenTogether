import { Pressable, SafeAreaView, View } from "react-native";
// import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";

import friends from "../../../assets/tabbar/friends.svg";
import home from "../../../assets/tabbar/home.svg";
import playlist from "../../../assets/tabbar/playlist.svg";
import search from "../../../assets/tabbar/search.svg";

const AppTabBar = ({ state }: BottomTabBarProps) => {
  const router = useRouter();

  const handlePress = (url: string) => {
    // void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(url);
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center justify-between bg-black px-8 py-3">
        <Pressable onPress={() => void handlePress("/tabbar/home")}>
          <Image
            source={home}
            className="h-8 w-8 "
            contentFit="contain"
            alt="home"
          />
        </Pressable>

        <Pressable onPress={() => void handlePress("/tabbar/search")}>
          <Image
            source={search}
            className={"h-10 w-12"}
            contentFit="contain"
            alt="search"
          />
        </Pressable>

        <Pressable onPress={() => void handlePress("/tabbar/playlist")}>
          <Image
            source={playlist}
            className={"h-7 w-9"}
            contentFit="contain"
            alt="playlist"
          />
        </Pressable>

        <Pressable onPress={() => void handlePress("/tabbar/friends")}>
          <Image
            source={friends}
            className={"h-10 w-12"}
            contentFit="contain"
            alt="friends"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AppTabBar;
