import { render, screen } from "@testing-library/react-native";

import { ThemedText } from "../themed-text";

describe("Theme Text Component", () => {
  it("Render the props with title label", () => {
    render(<ThemedText type="title">This is a title</ThemedText>);

    const titleText = screen.getByTestId("themed-text");

    expect(titleText).toBeDefined();
    expect(titleText).toHaveTextContent("This is a title");
    expect(titleText).toHaveStyle({
      fontFamily: "Roboto_600SemiBold",
    });
  });

  it("Render the props with subtitle label", () => {
    render(<ThemedText type="subtitle">This is a subtitle text</ThemedText>);

    const titleText = screen.getByTestId("themed-text");

    expect(titleText).toBeDefined();
    expect(titleText).toHaveTextContent("This is a subtitle text");
    expect(titleText).toHaveStyle({
      fontFamily: "Roboto_400Regular",
    });
  });
});
