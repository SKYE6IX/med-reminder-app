import axios, { InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { getValidAccessToken } from "./tokenUtils";

const localhost = Constants.expoConfig?.hostUri?.split(":").shift();

const api = axios.create({
  baseURL: `http://${localhost}:8080/`,
});

api.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();

  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export { api, InternalAxiosRequestConfig };
