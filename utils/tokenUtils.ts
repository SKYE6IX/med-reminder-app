import type { AuthResponse } from "@/types/auth-response";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
}

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    // We added a 60 second buffer to refresh before it actually expires
    return decoded.exp < currentTime + 60;
  } catch {
    return true;
  }
};

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync("accessToken", accessToken, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
  await SecureStore.setItemAsync("refreshToken", refreshToken, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

// TOKEN REFRESH
const PORT = 8080;
const localhost = Constants.expoConfig?.hostUri?.split(":")[0];
const baseURL = __DEV__ ? `http://${localhost}:${PORT}/api/v1/` : process.env.EXPO_PUBLIC_API_URL;

export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if (!accessToken || !refreshToken) return null;
  if (!isTokenExpired(accessToken)) return accessToken;

  try {
    const { data } = await axios.post<AuthResponse>(`${baseURL}auth/refresh`, {
      refreshToken,
    });

    await saveTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.log("An Error Occur In Refresh Token API call: ", error);
    return null;
  }
};
