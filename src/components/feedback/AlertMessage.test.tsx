// src/components/ui/alert-message.test.tsx
import { render, screen } from "@testing-library/react";
import { AlertMessage } from "./AlertMessage";

describe("AlertMessage", () => {
  it("renders title and description correctly", () => {
    render(
      <AlertMessage
        title="Error"
        description="Something went wrong"
        data={["Missing email", "Invalid password"]}
      />
    );

    // Assertions
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Missing email")).toBeInTheDocument();
    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });

  it("renders without optional props", () => {
    render(<AlertMessage />);
    // Still renders the Alert wrapper
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
