import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  size?: number;
};

export default function ArrowLeft({ color = "#353535", size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M11.6666 13.9583C11.5066 13.9583 11.3466 13.8975 11.225 13.775L7.89162 10.4417C7.64745 10.1975 7.64745 9.80164 7.89162 9.55747L11.225 6.22414C11.4691 5.97997 11.865 5.97997 12.1092 6.22414C12.3533 6.46831 12.3533 6.86417 12.1092 7.10834L9.21751 9.99998L12.1092 12.8916C12.3533 13.1358 12.3533 13.5317 12.1092 13.7758C11.9867 13.8975 11.8266 13.9583 11.6666 13.9583Z"
        fill={color}
      />
    </Svg>
  );
}
