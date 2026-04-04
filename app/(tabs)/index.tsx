import { Text } from "react-native";

export default function Home() {
  return <Text>Home !</Text>;
}

// Folder structure for how we want the app to be.
// Tabs
//    Main tabs:
//  home
//  my pills
//  add
//  refill
//  settings

//     All of these above will have tabs will have have these rules:
// Should only be availabale to authorized user.
// Some of them are going to have more nested pages(screen) and nested modals
//

// Other pages that won't need to be in the tabs include:
// Login page -> Forget password page (Nested page) -> code acttivation -> change password
// Rgister page
// Premimum action page.
// Payment gateway page.

// How does onboarding going to fix in in all this, and then to able to also
// directly navigate it way to a section when user either go to login page or register page.
