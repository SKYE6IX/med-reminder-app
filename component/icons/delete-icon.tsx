import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
};

export default function DeleteIcon({ color = "#353535" }: Props) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.99902 5.99758H20.9925M7.99722 5.99758V3.9983C7.99722 2.8987 8.8969 1.99902 9.9965 1.99902H13.9951C15.0947 1.99902 15.9943 2.8987 15.9943 3.9983V5.99758M9.9965 10.9958V16.9936M13.9951 10.9958V16.9936M18.9933 5.99758V19.9925C18.9933 21.0921 18.0936 21.9918 16.994 21.9918H6.99758C5.89798 21.9918 4.9983 21.0921 4.9983 19.9925V5.99758H18.9933Z"
        stroke={color}
        strokeWidth="1.99928"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
