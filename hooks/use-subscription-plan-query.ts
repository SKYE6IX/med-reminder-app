import { QueryKey } from "@/constants/query-keys";
import { SubscriptionPlanResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchSubscriptionPlan = async () => {
  const reponse = await api.get<SubscriptionPlanResponse>("subscriptions");
  return reponse.data;
};

export function useSubscriptionPlanQuery() {
  const { data } = useQuery({
    queryKey: [QueryKey.subscriptionPlan],
    queryFn: fetchSubscriptionPlan,
  });

  if (!data) {
    return {
      isPremiumPlan: false,
      maxMedications: 1,
    };
  }

  const isPremiumPlan = data.managedRelation && data.refillReminders && data.reminderPreference;

  return {
    isPremiumPlan,
    maxMedications: data.maxMedications,
    endAt: data.endAt ?? "",
    billingCycle: data.billingCycle,
    subscriptionStatus: data.subscriptionStatus,
  };
}
