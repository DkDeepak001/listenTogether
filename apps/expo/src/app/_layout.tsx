import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/tabbar/");
    // You can add any code you want to run on app start here
  }, []);
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <View className=" flex-1">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          ></Stack>
          <StatusBar />
        </View>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
