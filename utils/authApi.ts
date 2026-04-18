import axios from "axios";
import Constants from "expo-constants";

const localhost = Constants.expoConfig?.hostUri?.split(":").shift();

export const authApi = axios.create({
  baseURL: `http://${localhost}:8080/auth`,
});
