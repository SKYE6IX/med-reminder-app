import { ENTITLEMENT_KEY } from "@/constants/susbscription-key";
import { api, axios } from "@/utils/axiosInstance";
import { getTimeZone } from "@/utils/luxonUtil";
import Purchases from "react-native-purchases";

interface SyncSubscriptionRequest {
  willRenew: boolean;
  latestPurchaseDate: number;
  expirationDate: number;
  unsubscribeDetectedAt: number;
  zoneId: string;
}

export async function syncSubscriptionWithServer() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();

    const entitlement = customerInfo.entitlements.all[ENTITLEMENT_KEY];

    if (entitlement) {
      const requestBody: SyncSubscriptionRequest = {
        willRenew: entitlement.willRenew,
        latestPurchaseDate: entitlement.latestPurchaseDateMillis,
        expirationDate: entitlement.expirationDateMillis ?? 0,
        unsubscribeDetectedAt: entitlement.expirationDateMillis ?? 0,
        zoneId: getTimeZone(),
      };

      await api.put("subscriptions", requestBody);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("An Axios error occur: ", error);
    } else {
      console.log("Other error occur: ", error);
    }
  }
}
