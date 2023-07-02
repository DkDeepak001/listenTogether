import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api, TRPCProvider } from "~/utils/api";

const RootLayout = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <View className="flex-1">
          <AuthInitialize />
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

const AuthInitialize = () => {
  const router = useRouter();
  const initalizeAuth = useCallback(async () => {
    const code = await AsyncStorage.getItem("code");
    if (code) {
      router.push("/tabbar/home");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    void initalizeAuth();
  }, [initalizeAuth]);

  return <></>;
};
