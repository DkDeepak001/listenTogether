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
  const { mutateAsync: createUser } = api.user.create.useMutation({
    onSuccess: async (variable) => {
      console.log(variable, "variable");
      await AsyncStorage.setItem("user_id", variable?.id ?? "");
      router.push("/tabbar/home");
    },
  });
  const { mutateAsync: getRefreshToken } =
    api.user.getRefreshToken.useMutation();
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "3fd0b855d9be4752bf7529976415a1d9",
      scopes: scopes,
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
      const { access_token } = response.params;

      if (access_token) void setToken(access_token);
    }
  }, [response]);

  const setToken = async (token: string) => {
    try {
      console.log(token, "token");

      const refreshToken = await getRefreshToken({
        refresh_token: token,
      });

      await AsyncStorage.setItem("access_token", token);
      await AsyncStorage.setItem("refresh_token", refreshToken?.refresh_token);

      await createUser({
        accessToken: token,
        refreshToken: refreshToken.refresh_token,
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
