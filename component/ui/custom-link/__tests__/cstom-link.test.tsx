import { render, screen } from "@testing-library/react-native";

import CustomLink from "../custom-link";

describe("Custom Link Component", () => {
  it("Render links and label", () => {
    render(<CustomLink href="/create-account" label="Create Account" />);

    const link = screen.getByRole("link");
    const label = screen.getByTestId("custom-link-label");

    expect(link).toBeDefined();
    expect(label).toBeDefined();
    expect(label).toHaveTextContent("Create Account");
  });

  it("Render the correct variant", () => {
    render(
      <CustomLink
        href="/create-account"
        label="Create Account"
        variant="outline"
      />,
    );

    const view = screen.getByTestId("custom-link-view");

    expect(view).toBeDefined();
    expect(view).toHaveStyle({
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#E6E6E6",
    });
  });
});
