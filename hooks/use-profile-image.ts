import { useUserStore } from "@/stores/use-user-store";
import { useColorScheme } from "react-native";
import { useProfilesQuery } from "./use-profiles-query";

export function useProfileImage(profileId?: string): string {
  const scheme = useColorScheme();

  const emojiAvatar = useUserStore((state) => state.emojiAvatar);

  const { selfProfile, relationProfiles } = useProfilesQuery();

  const avatarPlaceholder =
    scheme === "dark"
      ? require("@/assets/images/avatar-placeholder-dark.png")
      : require("@/assets/images/avatar-placeholder-light.png");

  if (profileId) {
    const relation = relationProfiles.find((p) => p.id === profileId);
    const url = emojiAvatar.get(relation?.id ?? "") ?? relation?.imageUrl ?? avatarPlaceholder;
    return url;
  } else {
    const url =
      emojiAvatar.get(selfProfile?.id ?? "") ?? selfProfile?.imageUrl ?? avatarPlaceholder;
    return url;
  }
}
