import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  size?: number;
};

export default function PlusIcon({ color = "#FCFCFC", size = 8 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 8" fill="none">
      <Path
        d="M7.75 3.875C7.75 4.082 7.582 4.25 7.375 4.25H4.25V7.375C4.25 7.582 4.082 7.75 3.875 7.75C3.668 7.75 3.5 7.582 3.5 7.375V4.25H0.375C0.168 4.25 0 4.082 0 3.875C0 3.668 0.168 3.5 0.375 3.5H3.5V0.375C3.5 0.168 3.668 0 3.875 0C4.082 0 4.25 0.168 4.25 0.375V3.5H7.375C7.582 3.5 7.75 3.668 7.75 3.875Z"
        fill={color}
      />
    </Svg>
  );
}
