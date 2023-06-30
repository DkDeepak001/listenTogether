import React from "react";
import { Linking, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex flex-1 justify-center bg-black ">
      <Pressable
        className="w-2/4 self-center rounded-md bg-green-300  p-4"
        onPress={() => router.push("/auth/spotifyLogin")}
      >
        <Text className="text-center text-xl font-extrabold text-black">
          Login
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
