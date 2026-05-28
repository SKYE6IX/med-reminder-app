import { Relation } from "@/constants/relation";

export interface ProfileResponse {
  id: string;
  imageUrl: string | null;
  name: string;
  relation: Relation;
  isSelf: boolean;
}
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}
export interface SocialAuthRequest {
  providerId: string;
  provider: "APPLE" | "GOOGLE";
  jwtToken: string;
  fullName: string;
  email: string;
}
export interface SubscriptionPlanResponse {
  id: string;
  planType: "FREE" | "PRO";
  maxMedications: number | null;
  managedRelation: boolean;
  refillReminders: boolean;
  reminderPreference: boolean;
}
