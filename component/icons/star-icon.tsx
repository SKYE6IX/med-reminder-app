import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
};

export default function StarIcon({ color = "#1256DB" }: Props) {
  return (
    <Svg width="50" height="48" viewBox="0 0 50 48" fill="none">
      <Path
        d="M24.9966 0L32.7205 15.6479L49.9932 18.1725L37.4949 30.3458L40.4445 47.5435L24.9966 39.4196L9.54869 47.5435L12.4983 30.3458L0 18.1725L17.2726 15.6479L24.9966 0Z"
        fill={color}
      />
    </Svg>
  );
}
