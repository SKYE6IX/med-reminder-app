import { create } from "zustand";

interface FeebackStore {
  visible: boolean;
  status: "success" | "error";
  title: string;
  message: string;
  showFeedBack: ({
    title,
    message,
    status,
  }: {
    title: string;
    message: string;
    status: FeebackStore["status"];
  }) => void;
  hideFeedBack: () => void;
}

export const useFeedBackStore = create<FeebackStore>()((set) => ({
  visible: false,
  status: "success",
  title: "",
  message: "",

  showFeedBack({ title, message, status }) {
    set({ title, message, status, visible: true });
  },

  hideFeedBack() {
    set({ visible: false });
  },
}));
