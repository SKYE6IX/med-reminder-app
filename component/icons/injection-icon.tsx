import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
};

export default function InjectionIcon({ color = "#353535" }: Props) {
  return (
    <Svg width="45" height="45" viewBox="0 0 45 45" fill="none">
      <Path
        d="M8.57022 0.707202L10.0058 2.14282L2.14273 10.0059L0.707107 8.57031L8.57022 0.707202Z"
        stroke={color}
      />
      <Path
        d="M17.1421 4.99861L18.5777 6.43423L6.42984 18.5821L4.99422 17.1465L17.1421 4.99861Z"
        stroke={color}
      />
      <Path
        d="M17.1366 9.27947L35.712 27.8548L27.8489 35.7179L9.27351 17.1426L17.1366 9.27947Z"
        stroke={color}
      />
      <Path
        d="M7.49038 6.06047L11.068 9.63813L9.63242 11.0738L6.05476 7.49609L7.49038 6.06047Z"
        stroke={color}
      />
      <Path
        d="M41.4473 41.4492L33.9512 35.3164L35.3145 33.9531L41.4473 41.4492Z"
        fill={color}
        stroke={color}
      />
      <Path
        d="M35.8584 32.0107L32.0068 35.8623L29.8545 35.1387L35.1348 29.8584L35.8584 32.0107Z"
        fill={color}
        stroke={color}
      />
      <Path
        d="M19.2887 11.436L20.7243 12.8716L17.1466 16.4493L15.711 15.0137L19.2887 11.436Z"
        fill={color}
        stroke={color}
      />
      <Path
        d="M23.5602 15.7016L24.9958 17.1373L21.4181 20.7149L19.9825 19.2793L23.5602 15.7016Z"
        fill={color}
        stroke={color}
      />
      <Path
        d="M27.8456 19.9943L35.7087 27.8574L27.8456 35.7205L19.9825 27.8574L27.8456 19.9943Z"
        stroke={color}
      />
    </Svg>
  );
}
