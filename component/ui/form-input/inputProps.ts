export const inputProps = {
  text: {
    autoCorrect: false,
    autoCapitalize: "sentences" as const,
    keyboardType: "default" as const,
    returnKeyType: "next" as const,
  },
  email: {
    autoCapitalize: "none" as const,
    autoCorrect: false,
    keyboardType: "email-address" as const,
    returnKeyType: "next" as const,
    textContentType: "emailAddress" as const,
    autoComplete: "email" as const,
  },
  password: {
    autoCapitalize: "none" as const,
    autoCorrect: false,
    returnKeyType: "done" as const,
    textContentType: "newPassword" as const,
    autoComplete: "new-password" as const,
  },
};
