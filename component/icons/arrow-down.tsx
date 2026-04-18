import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
};

export default function ArrowDown({ color = "#99A1AF" }: Props) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M4.99902 7.49902L9.99834 12.4983L14.9977 7.49902"
        stroke={color}
        strokeWidth="1.66644"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
