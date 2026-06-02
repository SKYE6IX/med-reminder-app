import FeedbackAlert from "@/component/ui/feedback-alert";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/use-auth-store";
import { getValidAccessToken } from "@/utils/tokenUtils";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { PortalProvider } from "@gorhom/portal";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NotificationHelper } from "@/helpers/notification-helper";
import { api } from "@/utils/axiosInstance";
import { getAuthorizedUser } from "@/utils/getAuthorizedUser";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F7F7F7",
  },
};
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1C1C1E",
  },
};

export default function RootLayout() {
  const { isAuthenticated, hasCompleteOnboarding } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
  });

  const resetOnBoarding = async () => {
    await deleteItemAsync("auth-store");
  };

  async function bootstrap() {
    // Check for valid token and authorized user with it.
    const token = await getValidAccessToken();
    if (token) {
      // Prefetch Datas
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["subscriptions-plan"],
          queryFn: async () => (await api.get("subscriptions")).data,
        }),
        queryClient.prefetchQuery({
          queryKey: ["medication-profile", "list"],
          queryFn: async () => (await api.get("medications")).data,
        }),
      ]);
      getAuthorizedUser();
      useAuthStore.getState().setIsAuthenticated(true);
    } else {
      useAuthStore.getState().setIsAuthenticated(false);
    }

    // Handle when app is open by a notification
    await NotificationHelper.handleOnNotificationOpenApp();
  }

  useEffect(() => {
    bootstrap()
      .then(() => setIsReady(true))
      .catch((error) => {
        console.log("Error occur in bootstrap -> ", error);
        setIsReady(true);
      });
    // Susbscribe to foreground events for notifications
    const unsubscribe = NotificationHelper.handleOnForeGroundEvent();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // resetOnBoarding();
    // Only load the app after the fonts are loaded.
    if (isReady && (loaded || error)) {
      SplashScreen.hideAsync();
    }
  }, [error, isReady, loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
        <GestureHandlerRootView>
          <PortalProvider>
            <StatusBar style="auto" />
            <FeedbackAlert />
            <Stack>
              <Stack.Protected guard={!hasCompleteOnboarding}>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={!isAuthenticated && hasCompleteOnboarding}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>
          </PortalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// npx create-expo-module --local yokassa-sdk
// TODO:
// 1. Test on android ✅
// 2. Set up notification for Refilled Pack ✅
// 3. Animate the week calender selection, make it swipeable,
//    additionally, when user switch to new week, we should set a default,
//    and when they go back to previous week, we set to exacly when they were,
//    before they switch week. ✅
// 4. Implementation for adding image or emoji. ✅
// 5. bluring card when it has been set to in_active. ✅
// 6. Premium user flag and basic user flag feautures. ✅
// 7. Premimum page selections✅

// Considration on medication pack settings:
// We should have a default days reminder incase user choose not to set it.
// Another pure indication is:
// About Amount of pill selections and dosage and days or reminder need to
// able to work togehter.

// struct TokenizeOptions : Record {
//     @Field
//     var amount: Double = 0.0

//     @Field
//     var currency: String = "RUB"

//     @Field
//     var title: String = ""

//     @Field
//     var subtitle: String = ""

//     @Field
//     var clientApplicationKey: String = ""

//     @Field
//     var shopId: String = ""
// }
// public class YomoneySdkModule: Module {

//     private var pendingPromise: Promise?
//     private var tokenizationVC: UIViewController?

//   public func definition() -> ModuleDefinition {
//     Name("YomoneySdk")

//     AsyncFunction("startTokenize") { (options: TokenizeOptions, promise: Promise) in
//         guard let currentVC = appContext?.utilities?.currentViewController() else {
//               return promise.reject(Exceptions.MissingCurrentViewController())
//             }

//         guard self.pendingPromise == nil else {
//             return promise.reject("PENDING_PAYMENT",
//               "Another payment process is active")
//           }

//         self.pendingPromise = promise

//         let amount = Amount(
//                value: Decimal(options.amount),
//                currency: Currency(rawValue: options.currency) ?? .rub
//              )

//         let paymentParameters = TokenizationModuleInputData(
//              clientApplicationKey: options.clientApplicationKey,
//              title: options.title,
//              subtitle: options.subtitle,
//              amount: amount,
//              shopId: options.shopId,
//              savePaymentMethod: .userSelects,
//              paymentMethodTypes: [.bankCard, .sbp]
//            )

//         DispatchQueue.main.async {
//             let vc = TokenizationAssembly.makeModule(inputData: paymentParameters,
//                                                      moduleOutput: self)
//             self.tokenizationVC = vc
//             currentVC.present(vc, animated: true)
//         }
//     }
//   }

//     public func tokenizationModule(
//       _ module: TokenizationModuleInput,
//       didTokenize token: Tokens,
//       paymentMethodType: PaymentMethodType
//     ) {
//       dismissAndResolve(token: token, paymentMethodType: paymentMethodType)
//     }

//     public func didFinish(
//       on module: TokenizationModuleInput,
//       with error: YooKassaPaymentsError?
//     ) {
//       let promise = pendingPromise
//       pendingPromise = nil

//       DispatchQueue.main.async {
//         self.tokenizationVC?.dismiss(animated: true)
//         self.tokenizationVC = nil
//       }

//       if let error {
//         promise?.reject("TOKENIZATION_ERROR", error.localizedDescription)
//       } else {
//         // User cancelled
//         promise?.resolve(nil)
//       }
//     }

//     private func dismissAndResolve(token: Tokens, paymentMethodType: PaymentMethodType) {
//         let promise = pendingPromise
//         pendingPromise = nil

//         DispatchQueue.main.async {
//             self.tokenizationVC?.dismiss(animated: true){
//                 self.tokenizationVC = nil
//                 let response: [String: Any] = [
//                         "paymentToken": token.paymentToken,
//                         "paymentMethod": paymentMethodType.rawValue
//                       ]
//                 promise?.resolve(response)
//             }
//         }
//     }
// }
