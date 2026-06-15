import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  size?: number;
};

export default function AssayIcon({ color = "#353535", size = 45 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Path
        d="M15.5285 1.59375H28.2785M15.5285 1.59375V11.0901C15.5285 11.8297 15.3355 12.5565 14.9685 13.1987L2.16195 35.6102C0.542926 38.4435 2.58874 41.9688 5.85198 41.9688H37.955C41.2182 41.9688 43.264 38.4435 41.645 35.6102L28.8384 13.1987C28.4715 12.5565 28.2785 11.8297 28.2785 11.0901V1.59375M15.5285 1.59375H11.2785M28.2785 1.59375H32.5285M15.5285 32.4062H28.2785"
        stroke={color}
        strokeWidth="3.1875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
