import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChoicesList, {
  MAX_CHOICE_LENGTH,
  MAX_CHOICES_NUMBER,
} from "./ChoicesList";
import { useState } from "react";

const mockOnItemsChange = vi.fn();
const mockOnSetDefault = vi.fn();

// Helper functions

const renderChoicesList = (props = {}) => {
  const defaultProps = {
    choices: [],
    defaultChoice: "",
    hasError: false,
    onItemsChange: mockOnItemsChange,
    onSetDefault: mockOnSetDefault,
    ...props,
  };

  return render(<ChoicesList {...defaultProps} />);
};

const getInputField = () => {
  try {
    return screen.getByPlaceholderText("Enter choice...");
  } catch {
    return screen.getByPlaceholderText("Maximum choices reached");
  }
};

const getAddButton = () => {
  const buttons = screen.getAllByRole("button");
  const addButton = buttons.find((button) =>
    button.querySelector('svg[class*="lucide-plus"]')
  );
  if (!addButton) throw new Error("Add button not found");
  return addButton;
};

const getRemoveButtons = () => {
  const buttons = screen.getAllByRole("button");
  return buttons.filter((button) =>
    button.querySelector('svg[class*="lucide-trash"]')
  );
};

const getRadioButtonByLabel = (label: string) => {
  return screen.getByRole("radio", { name: label });
};

function TestWrapper() {
  const [choices, setChoices] = useState<string[]>([]);
  const [defaultChoice, setDefaultChoice] = useState("");
  return (
    <ChoicesList
      choices={choices}
      defaultChoice={defaultChoice}
      hasError={false}
      onItemsChange={setChoices}
      onSetDefault={setDefaultChoice}
    />
  );
}

describe("ChoicesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial rendering", () => {
    it("renders an empty list", () => {
      renderChoicesList();

      expect(getInputField()).toBeInTheDocument();
      expect(getAddButton()).toBeInTheDocument();
      expect(getAddButton()).toBeDisabled();
    });

    it("renders a non-empty list", () => {
      const choices = ["Item 1", "Item 2"];
      renderChoicesList({ choices, defaultChoice: "Item 1" });

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(getRadioButtonByLabel("Item 1")).toBeChecked();
    });
  });

  describe("Adding items", () => {
    it("adds a valid item when clicking add button", async () => {
      const user = userEvent.setup();
      renderChoicesList();

      await user.type(getInputField(), "New Item");
      await user.click(getAddButton());

      expect(mockOnItemsChange).toHaveBeenCalledWith(["New Item"]);
      expect(mockOnSetDefault).toHaveBeenCalledWith("New Item");
    });

    it("adds a valid item when pressing Enter", async () => {
      const user = userEvent.setup();
      renderChoicesList();

      await user.type(getInputField(), "New Item{enter}");

      expect(mockOnItemsChange).toHaveBeenCalledWith(["New Item"]);
      expect(mockOnSetDefault).toHaveBeenCalledWith("New Item");
    });

    it("clears input after adding item", async () => {
      const user = userEvent.setup();
      renderChoicesList();

      await user.type(getInputField(), "New Item");
      await user.click(getAddButton());

      expect(getInputField()).toHaveValue("");
    });

    it("trims whitespace when adding item", async () => {
      const user = userEvent.setup();
      renderChoicesList();

      await user.type(getInputField(), "  New Item  ");
      await user.click(getAddButton());

      expect(mockOnItemsChange).toHaveBeenCalledWith(["New Item"]);
    });

    it("sets first item as default automatically", async () => {
      const user = userEvent.setup();
      renderChoicesList();

      await user.type(getInputField(), "First Item");
      await user.click(getAddButton());

      expect(mockOnSetDefault).toHaveBeenCalledWith("First Item");
    });
  });

  describe("Input validation", () => {
    it("prevents adding empty items", async () => {
      const user = userEvent.setup();
      renderChoicesList();

      await user.type(getInputField(), "   ");
      expect(getAddButton()).toBeDisabled();

      await user.click(getAddButton());
      expect(mockOnItemsChange).not.toHaveBeenCalled();
    });

    it("prevents adding duplicate items", async () => {
      const user = userEvent.setup();
      renderChoicesList({ choices: ["Existing Item"] });

      await user.type(getInputField(), "Existing Item");
      expect(getAddButton()).toBeDisabled();
      expect(screen.getByText("Item already exists")).toBeInTheDocument();

      await user.click(getAddButton());
      expect(mockOnItemsChange).not.toHaveBeenCalled();
    });

    it("prevents adding items longer than max allowed characters", async () => {
      const user = userEvent.setup();
      const longItem = "a".repeat(MAX_CHOICE_LENGTH + 1);
      renderChoicesList();

      await user.type(getInputField(), longItem);
      expect(getAddButton()).toBeDisabled();
      expect(
        screen.getByText(
          `Name is too long (max ${MAX_CHOICE_LENGTH} characters)`
        )
      ).toBeInTheDocument();

      await user.click(getAddButton());
      expect(mockOnItemsChange).not.toHaveBeenCalled();
    });

    it("handles case-sensitive duplicate detection", async () => {
      const user = userEvent.setup();
      renderChoicesList({ choices: ["Item"] });

      await user.type(getInputField(), "item"); // Different case
      expect(getAddButton()).toBeEnabled();

      await user.click(getAddButton());
      expect(mockOnItemsChange).toHaveBeenCalledWith(["Item", "item"]);
    });

    it("allows adding items exactly max allowed characters long", async () => {
      const user = userEvent.setup();
      const exactLengthItem = "a".repeat(MAX_CHOICE_LENGTH);
      renderChoicesList();

      await user.type(getInputField(), exactLengthItem);
      expect(getAddButton()).toBeEnabled();

      await user.click(getAddButton());
      expect(mockOnItemsChange).toHaveBeenCalledWith([exactLengthItem]);
    });

    it("prevents adding more than max allowed items", async () => {
      userEvent.setup();
      const choices = Array.from(
        { length: MAX_CHOICES_NUMBER },
        (_, i) => `Item ${i + 1}`
      );
      renderChoicesList({ choices });

      expect(getInputField()).toBeDisabled();
      expect(getInputField()).toHaveAttribute(
        "placeholder",
        "Maximum choices reached"
      );
      expect(getAddButton()).toBeDisabled();
    });
  });

  describe("Removing items", () => {
    it("removes an item when clicking remove button", async () => {
      const user = userEvent.setup();
      const choices = ["Item 1", "Item 2"];
      renderChoicesList({ choices, defaultChoice: "Item 1" });

      const removeButtons = getRemoveButtons();
      await user.click(removeButtons[0]);

      expect(mockOnItemsChange).toHaveBeenCalledWith(["Item 2"]);
    });

    it("updates default item when removing the current default", async () => {
      const user = userEvent.setup();
      const choices = ["Item 1", "Item 2"];
      renderChoicesList({ choices, defaultChoice: "Item 1" });

      const removeButtons = getRemoveButtons();
      await user.click(removeButtons[0]); // Remove "Item 1" (the default)

      expect(mockOnItemsChange).toHaveBeenCalledWith(["Item 2"]);
      expect(mockOnSetDefault).toHaveBeenCalledWith("Item 2");
    });

    it("clears default when removing the last item", async () => {
      const user = userEvent.setup();
      renderChoicesList({ choices: ["Only Item"], defaultChoice: "Only Item" });

      const removeButtons = getRemoveButtons();
      await user.click(removeButtons[0]);

      expect(mockOnItemsChange).toHaveBeenCalledWith([]);
      expect(mockOnSetDefault).toHaveBeenCalledWith("");
    });
  });

  describe("Setting default item", () => {
    it("changes default item when selecting a different radio option", async () => {
      const user = userEvent.setup();
      const choices = ["Item 1", "Item 2"];
      renderChoicesList({ choices, defaultChoice: "Item 1" });

      const radioButton = getRadioButtonByLabel("Item 2");
      await user.click(radioButton);

      expect(mockOnSetDefault).toHaveBeenCalledWith("Item 2");
    });

    it("shows default badge on the current default item", () => {
      renderChoicesList({
        choices: ["Item 1", "Item 2"],
        defaultChoice: "Item 1",
      });

      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(getRadioButtonByLabel("Item 1")).toBeChecked();
    });

    it("does not show default badge on non-default items", () => {
      renderChoicesList({
        choices: ["Item 1", "Item 2"],
        defaultChoice: "Item 1",
      });

      const defaultBadges = screen.getAllByText("Default");
      expect(defaultBadges).toHaveLength(1);
    });
  });

  describe("Integration scenarios", () => {
    it("handles complete workflow: add, remove, change default", async () => {
      const user = userEvent.setup();
      render(<TestWrapper />);

      // Add first item
      await user.type(getInputField(), "First Item");
      await user.click(getAddButton());

      // Add second item
      await user.type(getInputField(), "Item 2");
      await user.click(getAddButton());

      // Wait for the radio with value 'Item 2' to appear and click it
      let secondRadio: HTMLElement | undefined;
      await waitFor(() => {
        const radios = screen.queryAllByRole("radio");
        secondRadio = radios.find(
          (radio) => radio.getAttribute("value") === "Item 2"
        );
        expect(secondRadio).toBeTruthy();
      });
      await user.click(secondRadio!);

      // Remove first item
      const removeButtons = getRemoveButtons();
      await user.click(removeButtons[0]);

      // Only 'Item 2' should remain
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.queryByText("First Item")).not.toBeInTheDocument();
    });
  });
});
