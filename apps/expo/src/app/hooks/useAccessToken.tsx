import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
