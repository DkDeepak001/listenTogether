import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView, { type WebViewNavigation } from "react-native-webview";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";

const clientId = "3fd0b855d9be4752bf7529976415a1d9";
const redirect_url = "https://listen-together-nextjs.vercel.app/api/spotify";
const scopes = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
]; // Add necessary scopes
const state = generateRandomString(16);

const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirect_url,
)}&response_type=code&scope=${encodeURIComponent(
  scopes.join(" "),
)}&state=${state}`;

const SpotifyLogin = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(0);
  const [codeProcessed, setCodeProcessed] = useState(false); // Add state variable

  const { mutateAsync: createUser } = api.user.create.useMutation({
    onSuccess: async (variable) => {
      await AsyncStorage.setItem("user_id", variable?.id ?? "");
      router.push("/tabbar/home");
    },
  });
  const { mutateAsync: getToken } = api.user.getToken.useMutation({});

  const handleNavigationStateChange = async (event: WebViewNavigation) => {
    try {
      const { url } = event;

      if (!codeProcessed && url && url.startsWith(redirect_url)) {
        console.log(counter, "counter");
        setCounter(counter + 1);
        setCodeProcessed(true);
        const code = url?.match(/code=([^&]+)/)[1];
        if (!code) return;
        const data = await getToken({ code });

        const refreshToken = data?.refresh_token ?? "";
        const accessToken = data?.access_token ?? "";

        await AsyncStorage.setItem("refresh_token", refreshToken);
        await AsyncStorage.setItem("access_token", accessToken);

        await createUser({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } catch (error) {
      console.log(error, "error");
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

export function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
