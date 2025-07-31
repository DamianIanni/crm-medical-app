import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Actions from "./actions";
import { renderWithClient } from "@/lib/test-utils";

// Mock next/navigation and next/link
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock mutations
const mockDeleteMember = jest.fn();
const mockDeletePatient = jest.fn();

jest.mock("@/hooks/team/useTeam", () => ({
  useDeleteTeamMember: () => ({
    mutate: mockDeleteMember,
    isLoading: false,
  }),
}));

jest.mock("@/hooks/patient/usePatient", () => ({
  useDeletePatient: () => ({
    mutate: mockDeletePatient,
    isLoading: false,
  }),
}));

// Mock auth context with different roles
const mockUser = {
  role: "admin",
};

jest.mock("../providers/AuthProvider", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

describe("Actions", () => {
  const mockPatient = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
  };

  const mockTeamMember = {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
  };

  beforeEach(() => {
    mockDeleteMember.mockReset();
    mockDeletePatient.mockReset();
  });

  it("renders all actions for patient route", () => {
    renderWithClient(<Actions data={mockPatient} route="patients" />);

    expect(
      screen.getByRole("button", { name: /View details/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    // expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  it("renders correct actions for team route with admin role", () => {
    renderWithClient(<Actions data={mockTeamMember} route="team" />);

    expect(
      screen.getByRole("button", { name: /view details/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /edit/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("hides delete button for team route with manager role", () => {
    mockUser.role = "manager";

    renderWithClient(<Actions data={mockTeamMember} route="team" />);

    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });

  it("hides info button when in info view", () => {
    renderWithClient(
      <Actions data={mockPatient} route="patients" inInfo={true} />
    );

    expect(
      screen.queryByRole("link", { name: /view details/i })
    ).not.toBeInTheDocument();
  });

  it("calls deletePatient mutation when deleting a patient", async () => {
    renderWithClient(<Actions data={mockPatient} route="patients" />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(deleteButton);

    // Click confirm in dialog
    const confirmButton = screen.getByRole("button", {
      name: /delete/i,
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeletePatient).toHaveBeenCalledWith(mockPatient.id);
    });
  });

  it("calls deleteTeamMember mutation when deleting a team member", async () => {
    mockUser.role = "admin";
    renderWithClient(<Actions data={mockTeamMember} route="team" />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(deleteButton);

    // Click confirm in dialog
    const confirmButton = screen.getByRole("button", {
      name: /delete/i,
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMember).toHaveBeenCalledWith(mockTeamMember.id);
    });
  });
});
