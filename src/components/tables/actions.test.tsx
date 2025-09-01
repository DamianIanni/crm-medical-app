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
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    date_of_birth: "1990-01-01",
    short_description: "Test patient"
  };

  const mockTeamMember = {
    user_id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    center_id: "1",
    center_name: "Test Center",
    role: "admin" as const,
    status: "active"
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
    // The delete button is inside the ActionDialog component
    const deleteButtons = screen.getAllByRole("button");
    const trashButton = Array.from(deleteButtons).find(button => 
      button.querySelector(".lucide-trash2"));
    expect(trashButton).toBeInTheDocument();
  });

  it("renders correct actions for team route with admin role", () => {
    renderWithClient(<Actions data={mockTeamMember} route="team" />);

    expect(
      screen.getByRole("button", { name: /view details/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    // The delete button is inside the ActionDialog component
    const deleteButtons = screen.getAllByRole("button");
    const trashButton = Array.from(deleteButtons).find(button => 
      button.querySelector(".lucide-trash2"));
    expect(trashButton).toBeInTheDocument();
  });

  it("hides delete button for team route with manager role", () => {
    mockUser.role = "manager";

    renderWithClient(<Actions data={mockTeamMember} route="team" />);

    // The trash icon should not be present when delete is hidden
    const deleteButtons = screen.queryAllByRole("button", { name: "" });
    const trashButton = Array.from(deleteButtons).find(button => 
      button.querySelector(".lucide-trash2"));
    expect(trashButton).toBeUndefined();
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

    // Click the trash icon to open the dialog
    const deleteButtons = screen.getAllByRole("button");
    const trashButton = Array.from(deleteButtons).find(button => 
      button.querySelector(".lucide-trash2"));
    expect(trashButton).toBeInTheDocument();
    await userEvent.click(trashButton!);

    // Wait for dialog to appear and click confirm button
    const confirmButton = await screen.findByRole("button", {
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

    // Click the trash icon to open the dialog
    const deleteButtons = screen.getAllByRole("button");
    const trashButton = Array.from(deleteButtons).find(button => 
      button.querySelector(".lucide-trash2"));
    expect(trashButton).toBeInTheDocument();
    await userEvent.click(trashButton!);

    // Wait for dialog to appear and click confirm button
    const confirmButton = await screen.findByRole("button", {
      name: /delete/i,
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMember).toHaveBeenCalledWith(mockTeamMember.user_id);
    });
  });
});
