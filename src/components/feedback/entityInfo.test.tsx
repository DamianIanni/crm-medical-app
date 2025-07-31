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
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "+45 12345678",
  dob: "1980-01-01",
  treatment: "CBT",
  sessionsCompleted: 2,
  sessions: [
    {
      date: "2025-06-01",
      notes: "Patient discussed progress.",
    },
    {
      date: "2025-06-08",
      notes: "Reviewed exposure exercises.",
    },
  ],
};

describe("EntityInfo", () => {
  it("renders patient info correctly", () => {
    renderWithClient(<EntityInfo data={mockPatient} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("CBT")).toBeInTheDocument();
  });

  it("renders accordion with session notes trigger", () => {
    renderWithClient(<EntityInfo data={mockPatient} />);
    expect(screen.getByText("Show session notes")).toBeInTheDocument();
  });

  it("shows session notes after clicking accordion", async () => {
    renderWithClient(<EntityInfo data={mockPatient} />);
    const trigger = screen.getByText("Show session notes");
    await userEvent.click(trigger);
    expect(screen.getByText("Patient discussed progress.")).toBeInTheDocument();
    expect(
      screen.getByText("Reviewed exposure exercises.")
    ).toBeInTheDocument();
  });

  it("does not show patient fields for a User object", () => {
    const userMock = {
      id: 99,
      firstName: "Alice",
      lastName: "Walker",
      email: "alice@example.com",
    };
    renderWithClient(<EntityInfo data={userMock} />);
    expect(screen.getByText("Alice Walker")).toBeInTheDocument();
    expect(screen.queryByText("Treatment")).not.toBeInTheDocument();
    expect(screen.queryByText("Show session notes")).not.toBeInTheDocument();
  });
});
