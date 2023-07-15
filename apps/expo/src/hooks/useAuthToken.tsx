import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";
import { useTokenStore } from "~/store/token";

const useAuthToken = () => {
  const { refreshToken, setRefreshToken, setToken, token } = useTokenStore();

  const { mutateAsync: getNewToken } = api.user.getRefreshToken.useMutation({});
  const getRefreshToken = async () => {
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    return refresh_token;
  };

  useEffect(() => {
    void getAcessToken();
  }, []);

  const getAcessToken = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    if (access_token && refresh_token) {
      setToken(access_token);
      setRefreshToken(refresh_token);
    }
  };

  const fetchToken = async () => {
    const refreshToken = await getRefreshToken();
    const newToken = await getNewToken({ refresh_token: refreshToken ?? "" });
    setToken(newToken.access_token ?? "");
    await AsyncStorage.setItem("access_token", newToken.access_token ?? "");
  };

  return {
    authToken: token,
    refreshToken: refreshToken,
    updateToken: fetchToken,
  };
};

export default useAuthToken;
