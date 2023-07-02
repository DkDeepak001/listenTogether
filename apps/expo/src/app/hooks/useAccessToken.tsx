import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initalizeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      setAccessToken(accessToken);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void initalizeAuth();
  }, [initalizeAuth]);

  return { accessToken, isLoading };
};

export default useAccessToken;

export const useAuthToken = () => {
  const _q = useQuery(
    ["authToken"],
    async () => {
      const { accessToken } = useAccessToken();
      return accessToken || null;
    },
    {
      refetchInterval: 1000, // 1 minutes
      retry: 10,
      retryDelay: 500, // 0.5 seconds
      staleTime: 1000, // 15 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
    },
  );
  return {
    ..._q,
    accessToken: _q,
  };
};
