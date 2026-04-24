import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  size?: number;
};

export default function ArrowRight({ color = "#353535", size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M8.33331 13.9584C8.17331 13.9584 8.01329 13.8976 7.89162 13.7751C7.64745 13.5309 7.64745 13.1351 7.89162 12.8909L10.7833 9.99925L7.89162 7.1076C7.64745 6.86344 7.64745 6.46757 7.89162 6.22341C8.13579 5.97924 8.53165 5.97924 8.77582 6.22341L12.1092 9.55674C12.3533 9.80091 12.3533 10.1968 12.1092 10.4409L8.77582 13.7743C8.65332 13.8976 8.49331 13.9584 8.33331 13.9584Z"
        fill={color}
      />
    </Svg>
  );
}
