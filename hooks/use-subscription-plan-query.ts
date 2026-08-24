import { QueryKey } from "@/constants/query-keys";
import { ENTITLEMENT_KEY } from "@/constants/susbscription-key";
import { SubscriptionPlanResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Purchases, { PurchasesEntitlementInfo } from "react-native-purchases";

const fetchSubscriptionPlan = async () => {
  const reponse = await api.get<SubscriptionPlanResponse>("subscriptions");
  return reponse.data;
};

export function useSubscriptionPlanQuery() {
  const [entitlement, setEntitlement] = useState<PurchasesEntitlementInfo | null>(null);

  useEffect(() => {
    const getEntitlement = async () => {
      const customerInfo = await Purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_KEY] ?? null;
      setEntitlement(entitlement);
    };

    getEntitlement();
  }, []);

  const { data } = useQuery({
    queryKey: [QueryKey.subscriptionPlan],
    queryFn: fetchSubscriptionPlan,
  });

  const isPremiumPlan = (data && data.plan === "PRO") || entitlement !== null;
  const isCancelled = entitlement !== null && entitlement.willRenew;

  return {
    isPremiumPlan,
    isCancelled,
  };
}
