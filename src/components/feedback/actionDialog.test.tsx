// src/components/feedback/__tests__/actionDialog.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { ActionDialog } from "../actionDialog";
import { ActionDialog } from "./actionDialog";

describe("ActionDialog", () => {
  it("opens dialog and calls onConfirm", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <ActionDialog
        title="Delete item"
        description="Are you sure you want to delete this?"
        onConfirm={onConfirm}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    );

    // 1. El botón de trigger está en el DOM
    const triggerButton = screen.getByRole("button");
    expect(triggerButton).toBeInTheDocument();

    // 2. Simula click y espera que se abra el dialog
    await user.click(triggerButton);
    expect(screen.getByText("Delete item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this?")
    ).toBeInTheDocument();

    // 3. Click en Confirm y espera que se haya llamado onConfirm
    const confirmBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
