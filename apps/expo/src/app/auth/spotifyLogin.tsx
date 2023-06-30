import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView, { type WebViewNavigation } from "react-native-webview";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const clientId = "3fd0b855d9be4752bf7529976415a1d9";
const redirect_url = "https://listen-together-nextjs.vercel.app/api/spotify";
const scopes = ["user-read-email", "user-read-private"]; // Add necessary scopes

const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirect_url,
)}&response_type=token&scope=${encodeURIComponent(scopes.join(" "))}`;

const SpotifyLogin = () => {
  const router = useRouter();
  console.log(authUrl, "authUrl");

  const handleNavigationStateChange = async (event: WebViewNavigation) => {
    const { url } = event;

    if (url && url.startsWith(redirect_url)) {
      const accessToken = url?.match(/access_token=([^&]+)/)[1];

      if (accessToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
        router.push("/tabbar/home");
      }
    }
  };
  return (
    <SafeAreaView className="flex flex-1 justify-center bg-black ">
      <WebView
        source={{ uri: authUrl }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
};

export default SpotifyLogin;
