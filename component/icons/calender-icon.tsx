import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  size?: number;
};

export default function CalenderIcon({ color = "#1256DB", size = 20 }: Props) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M6.66602 1.6665V4.99938"
        stroke={color}
        strokeWidth="1.66644"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3311 1.6665V4.99938"
        stroke={color}
        strokeWidth="1.66644"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.8315 3.33301H4.16644C3.24609 3.33301 2.5 4.0791 2.5 4.99945V16.6645C2.5 17.5849 3.24609 18.331 4.16644 18.331H15.8315C16.7519 18.331 17.4979 17.5849 17.4979 16.6645V4.99945C17.4979 4.0791 16.7519 3.33301 15.8315 3.33301Z"
        stroke={color}
        strokeWidth="1.66644"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 8.33203H17.4979"
        stroke={color}
        strokeWidth="1.66644"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
