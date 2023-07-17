import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";

import AppTabBar from "~/components/tabbar/tabbar";
import usePlayer from "~/hooks/usePlayer";

const BottomTabs = () => {
  const { player } = usePlayer();
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
