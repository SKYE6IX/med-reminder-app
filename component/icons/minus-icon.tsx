import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export default function MinusIcon({
  color = "#353535",
  width = 14,
  height = 2,
}: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 2" fill="none">
      <Path
        d="M0.833008 0.833008H12.4981"
        stroke={color}
        strokeWidth="1.66644"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
