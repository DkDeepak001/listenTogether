import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";

import { api } from "~/utils/api";
import AppTabBar from "~/components/tabbar/tabbar";

const BottomTabs = () => {
  const {
    data: player,
    isLoading,
    refetch,
  } = api.player.getPlayBackState.useQuery();

  useEffect(() => {
    console.log("player", player);
    console.log("progress_ms", player?.progress_ms);
    console.log("duration_ms", player?.item?.duration_ms);
    if (!player || !player.item) return;
    setTimeout(() => {
      void refetch();
      console.log("song over =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Change");
    }, Number(player.progress_ms / 10));
  }, [player]);

  return (
    <SafeAreaView className=" w-full flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <AppTabBar {...props} player={player} />}
      >
        <Tabs.Screen name="home" />
      </Tabs>
    </SafeAreaView>
  );
};

export default BottomTabs;
