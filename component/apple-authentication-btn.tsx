import * as AppleAuthentication from "expo-apple-authentication";

type AppleAuthenticationBtnProps = {
  buttonType: "SIGN_IN" | "SIGN_UP";
};

export default function AppleAuthenticationBtn() {
  const handleOnPress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Here is the value for the credential -> ", credential);
      // signed in
    } catch (e) {
      console.log("Error occur -> ", e);
      // if (e.code === "ERR_REQUEST_CANCELED") {
      //   // handle that the user canceled the sign-in flow
      // } else {
      //   // handle other errors
      // }
    }
  };

  // ASAuthorizationError.Code

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      onPress={handleOnPress}
    />
  );
}
