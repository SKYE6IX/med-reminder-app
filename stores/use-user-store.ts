import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  emojiAvatar: Map<string, string>;
  addEmojiAvatar: (profileId: string, avatarUri: string) => void;
  removeEmojiAvatar: (profileId: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      emojiAvatar: new Map(),
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
