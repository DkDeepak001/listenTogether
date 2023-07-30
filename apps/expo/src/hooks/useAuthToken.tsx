import { useEffect, useState } from "react";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";
import { useTokenStore } from "~/store/token";

const useAuthToken = () => {
  const { refreshToken, setRefreshToken, setToken, token } = useTokenStore();
  const parm = usePathname();

  const { mutateAsync: getNewToken } = api.user.getRefreshToken.useMutation({});

  useEffect(() => {
    void getAcessToken();
  }, []);

  const getAcessToken = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    console.log(
      access_token,
      refresh_token,
      "getAccess Token from useAuthToken useEffect----------------------------",
    );
    if (access_token) setToken(access_token);
    if (refresh_token) setRefreshToken(refresh_token);
  };

  const fetchToken = async (callback: () => void) => {
    console.log("fetchToken from useAuthToken----------------------------");
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    const newToken = await getNewToken({ refresh_token: refreshToken ?? "" });
    console.log(
      parm,
      "newToken from useAuthToken fetchToken----------------------------",
    );
    setToken(newToken.access_token ?? "");
    await AsyncStorage.setItem("access_token", newToken.access_token ?? "");
    callback();
  };

  return {
    authToken: token,
    refreshToken: refreshToken,
    updateToken: fetchToken,
  } as {
    authToken: string;
    refreshToken: string;
    updateToken: (callback: () => void) => void;
  };
};

export default useAuthToken;
