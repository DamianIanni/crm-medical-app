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
let mockIsLoginPending = false;
let mockIsErrorLogin = false;

jest.mock("../providers/AuthProvider", () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoginPending: mockIsLoginPending,
    isErrorLogin: mockIsErrorLogin,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockIsLoginPending = false;
    mockIsErrorLogin = false;
  });

  it("renders login form with all elements", () => {
    renderWithClient(<LoginForm />);

    // Check main elements
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login with apple/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login with google/i })
    ).toBeInTheDocument();

    // Check form fields
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login$/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithClient(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /login$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    renderWithClient(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /login$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    renderWithClient(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, "123");

    const submitButton = screen.getByRole("button", { name: /login$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  it("calls login function with valid credentials", async () => {
    mockLogin.mockResolvedValueOnce(true);

    renderWithClient(<LoginForm />);

    // Fill form
    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /login$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows loading state while logging in", async () => {
    mockIsLoginPending = true;
    renderWithClient(<LoginForm />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login with apple/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /login with google/i })
    ).toBeDisabled();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
  });

  it("shows error message on failed login", async () => {
    mockIsErrorLogin = true;
    renderWithClient(<LoginForm />);

    expect(screen.getByText("Unable to login")).toBeInTheDocument();
    expect(
      screen.getByText("Please check your credentials and try again.")
    ).toBeInTheDocument();
    expect(screen.getByText("Check your email")).toBeInTheDocument();
    expect(screen.getByText("Check your password")).toBeInTheDocument();
  });
});
