import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";

import AppTabBar from "~/components/tabbar/tabbar";

const BottomTabs = () => {
  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <AppTabBar {...props} />}
      >
        <Tabs.Screen name="home" />
      </Tabs>
    </SafeAreaView>
  );
};

export default BottomTabs;
