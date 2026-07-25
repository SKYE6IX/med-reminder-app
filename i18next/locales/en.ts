const en = {
  common: {
    next: "Next",
    add_medication: "Add Medication",
    form: {
      name_label: "Name",
      name_placeholder: "Enter your name",
      email_label: "Email",
      email_placeholder: "Enter your email address",
      password_label: "Password",
      password_placeholder: "Enter your password",
    },
  },
  feedback: {
    error: {
      general: {
        title: "Error!",
        text: "Something went wrong. Try again.",
      },
      otp: {
        title: "Authorization failed!",
        text: "Expired or invalid code.",
      },
      network: {
        title: "Network Error!",
        text: "Check your internet connection.",
      },
      authorized: {
        title: "Authorization error!",
        text: "Invalid email address or password.",
      },
    },
    success: {
      change_password: {
        title: "Success!",
        text: "Your password has been changed.",
      },
    },
  },
  tabs: {
    home: "Home",
    medications: "Medications",
    add_medication: "Add Meds",
    refills: "Refills",
    settings: "Settings",
  },
  offer_modal: {
    title: "Unlock premium features",
    text: "Add unlimited medications, personlize reminders, and manage your family's medications.",
    activate: "Activate",
    skip: "Skip",
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
  welcome_screen: {
    heading: "Monitor your medication intake simply",
    text: "All your pills are in one place.",
    create_account_btn: "Create Account",
    sign_in_btn: "Sign In",
  },
  sign_up_screen: {
    title: "Sign Up",
    sub_title: "Fill in the details to create your account",
    create_account_btn: "Create Account",
    terms_and_policy:
      "By Signing up, You agree to the <termsLink>Term of Service</termsLink> and <privacyLink>Privacy Policy</privacyLink>.",
    or: "Or",
    have_account: "Already Have an account?",
    sign_in: "Sign in",
  },
  sign_in_screen: {
    title: "Login",
    sub_title: "Fill in the details to Login to your account",
    sign_in_btn: "Login",
    forget_password: "Forget your password?",
    click_here: "Click here",
    or: "Or",
    no_account: "Don't have an account?",
    sign_up: "Sign up",
  },
  forget_passowrd_screen: {
    step1: {
      title: "Forgot Password",
      text: "Fill in the details to recover your account",
      recover: "Recover password",
    },
    step2: {
      title: "Enter Code",
      text: "We sent a verification code to your email {{email}}",
      change_email: "Change",
      continue: "Continue",
      no_code: "Didn’t receive any code?",
      request_again: "Resend code",
      try_again: "Try again in {{time}}",
    },
    setp3: {
      title: "New Password",
      text: "Enter your new password here",
      new_password_label: "New Password",
      new_password_placeholder: "Enter your new password",
      confirm_password_label: "Confirm New Password",
      confirm_password_placholder: "Re-enter your new Password",
      submit_text: "Create new Password",
    },
  },
  home_screen: {
    no_content_heading: "No Medications are Scheduled for this day",
    no_content_body: "You can add medications now.",
    week_view_to_current: "Current week",
    week_view_meds_for: "Medications for ",
    tab_all: "All",
    tab_taken: "Taken",
    tab_missed: "Missed",
    event_card_daily: "Daily",
    event_card_banner_taken: "Taken",
    event_card_banner_missed: "Missed",
    event_card_btn_taken: "Taken",
    event_card_btn_missed: "Skipped",
  },
} as const;

export default en;
export type Translation = typeof en;
