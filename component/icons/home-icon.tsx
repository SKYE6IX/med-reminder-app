import Svg, { Path } from "react-native-svg";
type Props = {
  color?: string;
  size?: number;
};

export default function HomeIcon({ color = "#1256DB", size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 17.9993H11.8C11.634 17.9993 11.5 17.8652 11.5 17.6992V13.4993C11.5 12.1183 10.381 10.9993 9 10.9993C7.619 10.9993 6.5 12.1183 6.5 13.4993V17.6992C6.5 17.8652 6.36595 17.9993 6.19995 17.9993H3C1 17.9993 0 16.9993 0 14.9993V8.65029C0 6.65229 0.523054 6.34535 1.43005 5.58535L7.39404 0.58425C8.32304 -0.19475 9.67806 -0.19475 10.6071 0.58425L16.571 5.58535C17.477 6.34535 18.001 6.65229 18.001 8.65029V14.9993C18 16.9993 17 17.9993 15 17.9993Z"
        fill={color}
      />
    </Svg>
  );
}
