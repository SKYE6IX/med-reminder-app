import Home from "@/app/index";
import { render } from "@testing-library/react-native";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    const { getByText } = render(<Home />);

    getByText("Hello world");
  });
});
