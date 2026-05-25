import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
};

export default function CheckIcon({ color = "white" }: Props) {
  return (
    <Svg width="12" height="9" viewBox="0 0 12 9" fill="none">
      <Path
        d="M10.2065 0.875L3.79108 7.29038L0.875 4.3743"
        stroke={color}
        strokeWidth="1.74965"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
