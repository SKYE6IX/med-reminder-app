import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import CustomPicker from "../custom-picker";

const mockItem = [
  { label: "label1", value: "value1" },
  { label: "label2", value: "value2" },
  { label: "label3", value: "value3" },
];

describe("Custom picker component", () => {
  it("render component label", () => {
    render(
      <CustomPicker
        label="Custom Picker"
        items={mockItem}
        onValueSelected={() => {}}
        selectedValue=""
      />,
    );

    const label = screen.getByText("Custom Picker");

    expect(label).toBeOnTheScreen();
  });

  it("render picker selection", async () => {
    render(
      <CustomPicker
        label="Custom Picker"
        items={mockItem}
        onValueSelected={() => {}}
        selectedValue=""
      />,
    );

    const button = screen.getByRole("button");

    const picker = screen.getByTestId("picker");

    fireEvent.press(button);

    await waitFor(() => {
      expect(picker).toBeOnTheScreen();
    });
  });
});
