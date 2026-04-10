import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

type LoaderIconProps = {
  defaultColor: string;
  pillLeftColor: string;
  pillRightColor: string;
};

export default function LoaderIcon({
  defaultColor,
  pillLeftColor,
  pillRightColor,
}: LoaderIconProps) {
  const ringRotation = useSharedValue(0);
  const pillRotaiton = useSharedValue(0);

  useEffect(() => {
    ringRotation.value = withRepeat(
      withTiming(1, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    pillRotaiton.value = withRepeat(
      withTiming(1, {
        duration: 3300,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [pillRotaiton, ringRotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `-${ringRotation.value * 360}deg` }],
  }));
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value * 360}deg` }],
  }));

  return (
    <>
      <Animated.View style={ringStyle}>
        <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <Path
            opacity="0.3"
            d="M49.9995 97.4124C76.207 97.4124 97.4521 76.1678 97.4521 49.9618C97.4521 23.7555 76.207 2.51099 49.9995 2.51099C23.7922 2.51099 2.54712 23.7555 2.54712 49.9618C2.54712 76.1678 23.7922 97.4124 49.9995 97.4124Z"
            stroke={defaultColor}
            strokeWidth="4.06733"
          />
          <Path
            opacity="0.5"
            d="M49.9992 5.03904C51.4063 5.03904 52.5469 3.91101 52.5469 2.51952C52.5469 1.12803 51.4063 0 49.9992 0C48.5921 0 47.4514 1.12803 47.4514 2.51952C47.4514 3.91101 48.5921 5.03904 49.9992 5.03904Z"
            fill={defaultColor}
          />
          <Path
            opacity="0.5"
            d="M97.4526 52.5932C98.8596 52.5932 99.9999 51.4652 99.9999 50.0737C99.9999 48.6822 98.8596 47.5542 97.4526 47.5542C96.0456 47.5542 94.9045 48.6822 94.9045 50.0737C94.9045 51.4652 96.0456 52.5932 97.4526 52.5932Z"
            fill={defaultColor}
          />
          <Path
            opacity="0.5"
            d="M49.9994 100C51.4065 100 52.5472 98.8719 52.5472 97.4803C52.5472 96.0886 51.4065 94.9604 49.9994 94.9604C48.5923 94.9604 47.4517 96.0886 47.4517 97.4803C47.4517 98.8719 48.5923 100 49.9994 100Z"
            fill={defaultColor}
          />
          <Path
            opacity="0.5"
            d="M2.54778 52.5932C3.95488 52.5932 5.09555 51.4652 5.09555 50.0737C5.09555 48.6822 3.95488 47.5542 2.54778 47.5542C1.14068 47.5542 0 48.6822 0 50.0737C0 51.4652 1.14068 52.5932 2.54778 52.5932Z"
            fill={defaultColor}
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          {
            position: "absolute",
          },
          pillStyle,
        ]}
      >
        <Svg width="72" height="31" viewBox="0 0 72 31" fill="none">
          <Path
            d="M14.3342 29.7419H57.3342C65.2503 29.7419 71.6675 23.3247 71.6675 15.4086C71.6675 7.49253 65.2503 1.07528 57.3342 1.07528H14.3342C6.41813 1.07528 0.000869751 7.49253 0.000869751 15.4086C0.000869751 23.3247 6.41813 29.7419 14.3342 29.7419Z"
            fill={pillLeftColor}
          />
          <Path
            d="M35.8338 29.7419H14.3335C6.41736 29.7419 2.67029e-05 23.3246 2.67029e-05 15.4084V15.4084C2.67029e-05 7.49226 6.41735 1.07493 14.3335 1.07493H35.8338V29.7419Z"
            fill={pillRightColor}
          />
          <Path
            d="M35.8338 29.7419V1.07493"
            stroke="white"
            strokeWidth="2.15"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </>
  );
}
