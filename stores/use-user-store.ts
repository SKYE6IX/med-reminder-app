import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  emojiAvatar: Map<string, string>;
  displaySubscriptioOffer: boolean;
  addEmojiAvatar: (profileId: string, avatarUri: string) => void;
  removeEmojiAvatar: (profileId: string) => void;
  disabledShowSubscriptionOffer: () => void;
  resetUserData: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      emojiAvatar: new Map(),
      displaySubscriptioOffer: true,
      addEmojiAvatar(profileId, avatarUri) {
        set((state) => ({
          ...state,
          emojiAvatar: new Map(state.emojiAvatar).set(profileId, avatarUri),
        }));
      },
      removeEmojiAvatar(profileId) {
        set((state) => {
          const next = new Map(state.emojiAvatar);
          next.delete(profileId);
          return { ...state, emojiAvatar: next };
        });
      },
      disabledShowSubscriptionOffer() {
        set((state) => ({ ...state, displaySubscriptioOffer: false }));
      },
      resetUserData() {
        set({
          emojiAvatar: new Map(),
          displaySubscriptioOffer: true,
        });
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(
        () => ({
          setItem: AsyncStorage.setItem,
          getItem: AsyncStorage.getItem,
          removeItem: AsyncStorage.removeItem,
        }),
        {
          reviver: (key, value) => {
            if (key === "emojiAvatar") {
              return new Map(Object.entries(value as Record<string, string>));
            }
            return value;
          },
          replacer(key, value) {
            if (key === "emojiAvatar") {
              // @ts-expect-error value type unknown
              return Object.fromEntries(value);
            }
            return value;
          },
        },
      ),
    },
  ),
);
