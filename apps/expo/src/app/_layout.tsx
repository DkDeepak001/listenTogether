import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <View className="bg-brand-primary flex-1">
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#f472b6",
              },
            }}
          />
          <StatusBar />
        </View>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
