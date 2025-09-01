// src/components/ui/alert-message.test.tsx
import { render, screen } from "@testing-library/react";
import { AlertMessage } from "./AlertMessage";

describe("AlertMessage", () => {
  it("renders title and description correctly", () => {
    render(
      <AlertMessage
        variant="error"
        title="Error"
        description="Something went wrong"
        messages={["Missing email", "Invalid password"]}
      />
    );

    // Assertions
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    
    // Check for list items instead of direct text
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
    expect(listItems[0].textContent).toContain("Missing email");
    expect(listItems[1].textContent).toContain("Invalid password");
  });

  it("renders without optional props", () => {
    render(<AlertMessage />);
    // Still renders the Alert wrapper
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
