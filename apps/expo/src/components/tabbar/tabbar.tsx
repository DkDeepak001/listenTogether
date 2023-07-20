import { Pressable, SafeAreaView, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
// import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { type api } from "~/utils/api";
import friends from "../../../assets/tabbar/friends.svg";
import home from "../../../assets/tabbar/home.svg";
import playlist from "../../../assets/tabbar/playlist.svg";
import search from "../../../assets/tabbar/search.svg";
import upload from "../../../assets/tabbar/upload.svg";
import Miniplayer from "../player/miniplayer";

type AppTabBarProps = BottomTabBarProps & {
  player?: ReturnType<
    ReturnType<typeof api.useContext>["player"]["getPlayBackState"]["getData"]
  >;
};

const AppTabBar = ({ state, player }: AppTabBarProps) => {
  const router = useRouter();

  const handlePress = (url: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(url);
  };

  return (
    <SafeAreaView className="bg-black">
      {/* {player?.item && (
        <Miniplayer
          player={player}
          pressableProps={{ onPress: () => router.push("/player/full") }}
        />
      )} */}

      <View className="flex-row items-center justify-between bg-black/95 px-4 py-3">
        <Pressable
          onPress={() => void handlePress("/tabbar/home")}
          className={`flex h-14 w-1/6 items-center justify-center rounded-full ${
            state.index === 0 ? "bg-blue-700" : ""
          }  py-2`}
        >
          <Image
            source={home}
            className="h-8 w-8 "
            contentFit="contain"
            alt="home"
          />
        </Pressable>

        <Pressable
          onPress={() => void handlePress("/tabbar/search")}
          className={`flex h-14 w-1/6 items-center justify-center rounded-full ${
            state.index === 1 ? "bg-blue-700" : ""
          }  py-2`}
        >
          <Image
            source={search}
            className={"h-10 w-12"}
            contentFit="contain"
            alt="search"
          />
        </Pressable>
        <Pressable
          onPress={() => void handlePress("/tabbar/upload")}
          className={`flex h-14 w-1/6 items-center justify-center rounded-full ${
            state.index === 4 ? "bg-blue-700" : ""
          }  py-2`}
        >
          <Image
            source={upload}
            className={"h-8 w-12"}
            contentFit="contain"
            alt="upload"
          />
        </Pressable>

        <Pressable
          onPress={() => void handlePress("/tabbar/playlist")}
          className={`flex h-14 w-1/6 items-center justify-center rounded-full ${
            state.index === 3 ? "bg-blue-700" : ""
          }  py-2`}
        >
          <Image
            source={playlist}
            className={"h-7 w-9"}
            contentFit="contain"
            alt="playlist"
          />
        </Pressable>

        <Pressable
          onPress={() => void handlePress("/tabbar/friends")}
          className={`flex h-14 w-1/6 items-center justify-center rounded-full ${
            state.index === 2 ? "bg-blue-700" : ""
          }  py-2`}
        >
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
