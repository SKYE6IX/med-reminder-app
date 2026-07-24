const en = {
  common: {
    next: "Next",
  },
  onboarding: {
    step1: {
      title: "Your health is in your hands",
      text: "Take control of your well-being with effortless medication reminders.",
    },
    step2: {
      title: "Advanced reminders, Easy use",
      text: "Stay on track with ease and peace of mind, ensuring you never miss a dose.",
    },
    step3: {
      title: "For yourself and family",
      text: "Easily manage medication for everyone you care about with Seamless.",
    },
    step4: {
      title: "Allow notification access",
      text: "We will provide timely notifications base on your preference settings.",
    },
  },
} as const;

export default en;
export type Translation = typeof en;
