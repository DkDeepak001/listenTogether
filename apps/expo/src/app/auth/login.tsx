import * as React from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";
import { scopes } from "~/constants/scope";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};
function Login() {
  const router = useRouter();
  const { mutateAsync: getToken } = api.user.getToken.useMutation({});
  const { mutateAsync: createUser } = api.user.create.useMutation({
    onSuccess: async (variable) => {
      await AsyncStorage.setItem("user_id", variable?.id ?? "");
      router.push("/tabbar/home");
    },
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      extraParams: {
        response_type: "code",
      },
      clientId: "3fd0b855d9be4752bf7529976415a1d9",
      scopes: [
        "user-read-email",
        "user-read-private",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-modify-playback-state",
        "user-read-recently-played",
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: "listentogether://tabbar/home",
      }),
    },
    discovery,
  );

  React.useEffect(() => {
    console.log(response, "response");
    if (response?.type === "success") {
      const { code } = response.params;

      if (code) void getTokenByCode(code);
    }
  }, [response]);

  const getTokenByCode = async (code: string) => {
    try {
      const data = await getToken({ code });

      await AsyncStorage.setItem("refresh_token", data?.refresh_token ?? "");
      await AsyncStorage.setItem("access_token", data?.access_token ?? "");
      await createUser({
        accessToken: data?.access_token,
        refreshToken: data?.refresh_token,
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <SafeAreaView>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          void promptAsync();
        }}
      />
    </SafeAreaView>
  );
}

export default Login;
