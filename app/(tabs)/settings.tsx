import { useAuthStore } from "@/stores/use-auth-store";
import { clearTokens } from "@/utils/tokenUtils";
import { Button } from "react-native";

export default function Settings() {
  const { setIsAuthenticated } = useAuthStore();
  const logoutUser = () => {
    clearTokens();
    setIsAuthenticated(false);
  };

  return <Button title="Logout" onPress={logoutUser} />;
}
