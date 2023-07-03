import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "~/utils/api";

const useAuthToken = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const { mutateAsync: getNewToken } = api.user.getRefreshToken.useMutation({});
  const { data, isError, refetch } = api.spotify.getUser.useQuery({
    accessToken: authToken ?? "",
  });
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
      setAuthToken(access_token);
      setRefreshToken(refresh_token);
    }
  };

  const fetchToken = async () => {
    const refreshToken = await getRefreshToken();
    const newToken = await getNewToken({ refresh_token: refreshToken ?? "" });
    setAuthToken(newToken.access_token ?? "");
  };

  return {
    authToken,
    refreshToken: refreshToken,
    updateToken: fetchToken,
  };
};

export default useAuthToken;
