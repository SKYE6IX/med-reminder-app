import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const BASE_WIDTH = 375;

export const scale = (size: number) => (width / BASE_WIDTH) * size;

export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
