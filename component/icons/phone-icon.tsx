import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
};

export default function PhoneIcon({ color = "#353535" }: Props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.75C6.58579 2.75 6.25 3.08579 6.25 3.5V20.5C6.25 20.9142 6.58579 21.25 7 21.25H17C17.4142 21.25 17.75 20.9142 17.75 20.5V3.5C17.75 3.08579 17.4142 2.75 17 2.75H7ZM4.75 3.5C4.75 2.25736 5.75736 1.25 7 1.25H17C18.2426 1.25 19.25 2.25736 19.25 3.5V20.5C19.25 21.7426 18.2426 22.75 17 22.75H7C5.75736 22.75 4.75 21.7426 4.75 20.5V3.5Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.25 5C10.25 4.58579 10.5858 4.25 11 4.25H13C13.4142 4.25 13.75 4.58579 13.75 5C13.75 5.41421 13.4142 5.75 13 5.75H11C10.5858 5.75 10.25 5.41421 10.25 5Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.25 19C9.25 18.5858 9.58579 18.25 10 18.25H14C14.4142 18.25 14.75 18.5858 14.75 19C14.75 19.4142 14.4142 19.75 14 19.75H10C9.58579 19.75 9.25 19.4142 9.25 19Z"
        fill={color}
      />
    </Svg>
  );
}
