import axios from "axios";

import { getValidAccessToken } from "./tokenUtils";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken();

  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export { api };
