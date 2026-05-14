import { Relation } from "@/constants/relation";

export interface ProfileResponse {
  id: string;
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
