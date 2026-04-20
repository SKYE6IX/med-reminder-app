import { render, screen, userEvent } from "@testing-library/react-native";
import FormInput from "../form-input";

describe("FormInput component", () => {
  it("render label", () => {
    render(
      <FormInput
        label="Test Label"
        name="test-input"
        hasError={false}
        onValueChange={() => {}}
      />,
    );

    const label = screen.getByText("Test Label");
    expect(label).toBeOnTheScreen();
  });

  it("render input by placeholder", () => {
    render(
      <FormInput
        label="Test Label"
        name="test-input"
        hasError={false}
        onValueChange={() => {}}
        placeholder="Test placeholder"
      />,
    );

    const input = screen.getByPlaceholderText("Test placeholder");
    expect(input).toBeOnTheScreen();
  });

  test("user's events actions", async () => {
    const user = userEvent.setup();

    render(
      <FormInput
        label="Test Label"
        hasError={false}
        name="test-input"
        onValueChange={() => {}}
        placeholder="Test placeholder"
      />,
    );

    const input = screen.getByPlaceholderText("Test placeholder");

    await user.type(input, "John");
    expect(input).toHaveDisplayValue("John");

    const clearButton = await screen.findByRole("button");

    await user.press(clearButton);
    expect(input).toHaveDisplayValue("");
  });
});
