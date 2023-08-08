import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { TRPCProvider } from "~/utils/api";
import useAuthToken from "~/hooks/useAuthToken";

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const { refreshToken } = useAuthToken();
  const firstTimeRef = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        void refetch();
        return;
      }
    }, [refetch]),
  );
}

const RootLayout = () => {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <View className="flex-1">
          <AuthInitialize />
          <StatusBar backgroundColor="#000" style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="friends/add"
              options={{
                headerShown: true,
                title: "",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="notification/notification"
              options={{
                animation: "slide_from_right",
                headerShown: true,
                title: "Notification",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="player/full"
              options={{
                animation: "fade_from_bottom",
                animationDuration: 1000,
              }}
            />
            <Stack.Screen
              name="playlist/upload"
              options={{
                animation: "slide_from_right",
                headerShown: true,
                title: "Upload",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "#fff",
              }}
            />
          </Stack>
        </View>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;

const AuthInitialize = () => {
  const router = useRouter();
  const initalizeAuth = useCallback(async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const refresh_token = await AsyncStorage.getItem("refresh_token");

    if (access_token && refresh_token) {
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
