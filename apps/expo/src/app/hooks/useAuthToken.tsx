import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";

const useAuthToken = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const { mutateAsync: getNewToken } = api.user.getRefreshToken.useMutation({});

  const getAcessToken = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    if (access_token && refresh_token) {
      setAuthToken(access_token);
      setRefreshToken(refresh_token);
    }
  };
  useEffect(() => {
    void getAcessToken();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchToken, (3600 - 120) * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchToken = async () => {
    const newToken = await getNewToken({ refresh_token: refreshToken ?? "" });
    setAuthToken(newToken.access_token ?? "");
  };

  return {
    authToken,
    refreshToken: refreshToken,
  };
};

export default useAuthToken;
