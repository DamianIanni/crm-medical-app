import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntityInfo from "./entityInfo";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderWithClient } from "@/lib/test-utils";

jest.mock("../providers/AuthProvider", () => ({
  useAuth: () => ({
    user: { role: "admin" },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/api/auth/getUserFromCookies", () => ({
  getUserFromCookies: jest.fn().mockResolvedValue({
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
  }),
}));

// jest.mock("@/lib/api/auth/getUserFromCookies", () => ({
//   getUserFromCookies: jest.fn(() => Promise.resolve({ id: 1, role: "admin" })),
// }));

jest.mock("@/lib/api/jwtUtil", () => ({
  verifyJWT: jest.fn(() =>
    Promise.resolve({
      id: 1,
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: "admin",
    })
  ),
}));

const mockPatient = {
  id: "1", // Changed to string to match expected type
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "+45 12345678",
  date_of_birth: "1980-01-01",
  treatment: "CBT",
  short_description: "CBT",
  notes: [
    {
      id: "1",
      date: "2025-06-01",
      note: "Patient discussed progress.",
    },
    {
      id: "2",
      date: "2025-06-08",
      note: "Reviewed exposure exercises.",
    },
  ],
};

describe("EntityInfo", () => {
  it("renders patient info correctly", () => {
    renderWithClient(<EntityInfo data={mockPatient} type="patient" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("CBT")).toBeInTheDocument();
  });

  it("renders accordion with session notes trigger", () => {
    renderWithClient(<EntityInfo data={mockPatient} type="patient" />);
    expect(screen.getByText(/notes/i)).toBeInTheDocument();
  });

  it("shows session notes after clicking accordion", async () => {
    renderWithClient(<EntityInfo data={mockPatient} type="patient" />);
    const trigger = screen.getByText(/notes/i);
    await userEvent.click(trigger);
    expect(screen.getByText("Patient discussed progress.")).toBeInTheDocument();
    expect(
      screen.getByText("Reviewed exposure exercises.")
    ).toBeInTheDocument();
  });

  it("does not show patient fields for a User object", () => {
    const userMock = {
      id: "99", // Changed to string to match expected type
      user_id: "99", // Added required field
      first_name: "Alice",
      last_name: "Walker",
      email: "alice@example.com",
      role: "admin" as const, // Const assertion to match expected enum type
      center_id: "1", // Added required field
      status: "active" // Added required field
    };
    renderWithClient(<EntityInfo data={userMock} type="user" />);
    expect(screen.getByText("Alice Walker")).toBeInTheDocument();
    expect(screen.queryByText(/treatment/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/notes/i)).not.toBeInTheDocument();
  });
});
