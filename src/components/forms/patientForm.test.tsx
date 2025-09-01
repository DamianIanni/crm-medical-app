import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatientForm } from "./patientForm";
import { renderWithClient } from "@/lib/test-utils";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock custom hooks
jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

// Mock mutation hooks with loading state
let isLoading = false;
const mockMutateAsync = jest.fn().mockImplementation(() => {
  isLoading = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      isLoading = false;
      resolve({});
    }, 100);
  });
});

jest.mock("@/hooks/patient/usePatient", () => ({
  useCreatePatient: () => ({
    mutateAsync: mockMutateAsync,
    isLoading,
  }),
  useUpdatePatient: () => ({
    mutateAsync: mockMutateAsync,
    isLoading,
  }),
}));

const mockPatient = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "+45 12345678",
  short_description: "CBT",
  date_of_birth: "1990-01-01",
};

describe("PatientForm", () => {
  it("renders create form by default", () => {
    renderWithClient(<PatientForm />);

    expect(screen.getByText("createTitle")).toBeInTheDocument();
    expect(screen.getByText("createDescription")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "createButton" })).toBeInTheDocument();
  });

  it("renders edit form when mode is edit", () => {
    renderWithClient(<PatientForm mode="edit" data={mockPatient} />);

    expect(screen.getByText("editTitle")).toBeInTheDocument();
    expect(screen.getByText("editDescription")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "saveButton" })
    ).toBeInTheDocument();
  });

  it("prefills form fields in edit mode", () => {
    renderWithClient(<PatientForm mode="edit" data={mockPatient} />);

    expect(screen.getByRole("textbox", { name: /firstNameLabel/i })).toHaveValue(
      "John"
    );
    expect(screen.getByRole("textbox", { name: /lastNameLabel/i })).toHaveValue(
      "Doe"
    );
    expect(screen.getByRole("textbox", { name: /emailLabel/i })).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByRole("textbox", { name: /phoneLabel/i })).toHaveValue(
      "+45 12345678"
    );
    expect(screen.getByRole("textbox", { name: /diagnoseLabel/i })).toHaveValue(
      "CBT"
    );
  });

  it("validates required fields", async () => {
    renderWithClient(<PatientForm />);

    const submitButton = screen.getByRole("button", { name: "createButton" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      // These will depend on your validation messages, adjust as needed
      expect(screen.getAllByText(/required/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/required/i)[1]).toBeInTheDocument();
      expect(screen.getAllByText(/required/i)[2]).toBeInTheDocument();
      expect(screen.getAllByText(/required/i)[3]).toBeInTheDocument();
    });
  });

  it("validates email", async () => {
    renderWithClient(<PatientForm />);

    // Fill form fields
    await userEvent.type(
      screen.getByRole("textbox", { name: /emailLabel/i }),
      "invalid-email"
    );

    const submitButton = screen.getByRole("button", { name: "createButton" });
    await userEvent.click(submitButton);

    // Wait for validation to complete and check that form submission didn't happen
    await waitFor(() => {
      // The mutation should not have been called with invalid data
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });

  it("validates phone number", async () => {
    renderWithClient(<PatientForm />);

    // Fill form fields with invalid phone number
    await userEvent.type(
      screen.getByRole("textbox", { name: /phoneLabel/i }),
      "invalid-phone"
    );

    const submitButton = screen.getByRole("button", { name: /createButton/i });
    await userEvent.click(submitButton);

    // Wait for validation to complete and check that form submission didn't happen
    await waitFor(() => {
      // The mutation should not have been called with invalid data
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });

  it("submits form with valid data", async () => {
    // Mock the date_of_birth field since we can't interact with the calendar in tests
    jest.spyOn(jest.requireActual('react-hook-form'), 'useForm').mockImplementationOnce(() => {
      const original = jest.requireActual('react-hook-form').useForm;
      const form = original({
        defaultValues: {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          short_description: "",
          date_of_birth: "1990-01-01", // Pre-set the date
        }
      });
      return form;
    });

    renderWithClient(<PatientForm />);

    // Fill form fields
    await userEvent.type(
      screen.getByRole("textbox", { name: /firstNameLabel/i }),
      "Jane"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /lastNameLabel/i }),
      "Smith"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /emailLabel/i }),
      "jane@example.com"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /phoneLabel/i }),
      "+45 87654321"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /diagnoseLabel/i }),
      "Therapy"
    );

    const submitButton = screen.getByRole("button", { name: "createButton" });
    await userEvent.click(submitButton);

    // Wait for the form submission
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });


  //   it("submits form with valid data", async () => {
  //     const { container } = renderWithClient(<PatientForm />);

  //     // Fill form fields
  //     await userEvent.type(
  //       screen.getByRole("textbox", { name: /first name/i }),
  //       "Jane"
  //     );
  //     await userEvent.type(
  //       screen.getByRole("textbox", { name: /last name/i }),
  //       "Smith"
  //     );
  //     await userEvent.type(
  //       screen.getByRole("textbox", { name: /email/i }),
  //       "jane@example.com"
  //     );
  //     await userEvent.type(
  //       screen.getByRole("textbox", { name: /phone/i }),
  //       "+45 87654321"
  //     );
  //     await userEvent.type(
  //       screen.getByRole("textbox", { name: /treatment/i }),
  //       "Therapy"
  //     );

  //     // Select date
  //     const dateButton = container.querySelector('button[name="dob"]');
  //     if (dateButton) {
  //       await userEvent.click(dateButton);
  //       const dateCell = screen.getByRole("button", { name: /1990/i });
  //       await userEvent.click(dateCell);
  //     }

  //     const submitButton = screen.getByRole("button", { name: /create/i });
  //     await userEvent.click(submitButton);

  //     // Check loading state
  //     await waitFor(() => {
  //       const button = screen.getByRole("button", { name: /create/i });
  //       expect(button).toBeInTheDocument();
  //       expect(mockMutateAsync).toHaveBeenCalled();
  //       //   expect(submitButton).toHaveAttribute("disabled");
  //     });
  //   });
});
