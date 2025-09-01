import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./loginForm";
import { renderWithClient } from "@/lib/test-utils";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock auth context
const mockLogin = jest.fn();

// Create mock functions that can be updated between tests
const mockAuthValues = {
  isLoginPending: false,
  isErrorLogin: false
};

jest.mock("../providers/AuthProvider", () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoginPending: mockAuthValues.isLoginPending,
    isErrorLogin: mockAuthValues.isErrorLogin,
  }),
}));

// Use the existing next-intl mock from __mocks__ directory

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockAuthValues.isLoginPending = false;
    mockAuthValues.isErrorLogin = false;
  });

  it("renders login form with all elements", () => {
    renderWithClient(<LoginForm />);

    // Check for email field
    expect(screen.getByRole("textbox", { name: /emailLabel/i })).toBeInTheDocument();
    
    // Check for password field (type="password")
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
    
    // Check for submit button
    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithClient(<LoginForm />);

    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).not.toBeNull();
    await userEvent.click(submitButton as HTMLElement);

    // Check that the login function was not called with empty fields
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it("validates email format", async () => {
    renderWithClient(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: /emailLabel/i });
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).not.toBeNull();
    await userEvent.click(submitButton as HTMLElement);

    // Check that the login function was not called with invalid data
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it("validates password length", async () => {
    renderWithClient(<LoginForm />);

    const passwordInput = screen.getByLabelText(/passwordLabel/i);
    await userEvent.type(passwordInput, "123");

    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).not.toBeNull();
    await userEvent.click(submitButton as HTMLElement);

    // Check that the login function was not called with invalid data
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it("calls login function with valid credentials", async () => {
    mockLogin.mockResolvedValueOnce(true);

    renderWithClient(<LoginForm />);

    // Fill form
    await userEvent.type(
      screen.getByRole("textbox", { name: /emailLabel/i }),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(/passwordLabel/i), "password123");

    // Submit form
    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).not.toBeNull();
    await userEvent.click(submitButton as HTMLElement);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows loading state when submitting", async () => {
    mockAuthValues.isLoginPending = true;
    renderWithClient(<LoginForm />);

    // Check that a button with loading state is present
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    
    // At least one button should have loading state
    const loadingButtonExists = buttons.some(button => 
      button.textContent?.toLowerCase().includes("loading") || 
      button.getAttribute("aria-busy") === "true"
    );
    expect(loadingButtonExists).toBe(true);
  });

  it("shows error message on failed login", async () => {
    mockAuthValues.isErrorLogin = true;
    renderWithClient(<LoginForm />);

    // Check for error-related elements using more flexible queries
    // We're looking for any error-related text since the exact implementation may vary
    const errorElements = screen.getAllByRole("alert");
    expect(errorElements.length).toBeGreaterThan(0);
    
    // Verify that some error-related text is displayed
    const errorTexts = screen.getAllByText(/error|invalid|failed/i);
    expect(errorTexts.length).toBeGreaterThan(0);
  });
});
