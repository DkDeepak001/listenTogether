import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "listentogether",
  slug: "listentogether",
  scheme: "listentogether",
  owner: "dk_deepak",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splashScreen.png",
    resizeMode: "contain",
    backgroundColor: "#111111",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.listentogether",
  },
  android: {
    package: "com.listentogether",
    backgroundColor: "#111111",

    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#111111",
    },
  },
  extra: {
    eas: {
      projectId: "565fd771-5291-4b50-b42f-00294b56217c",
    },
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    apiUrl: process.env.API_URL ?? "localhost:3000",
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
