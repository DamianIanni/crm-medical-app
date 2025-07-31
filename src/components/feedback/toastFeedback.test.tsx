// src/components/feedback/toastFeedback.test.tsx
import { ToastFeedback } from "./toastFeedback";
import { render } from "@testing-library/react";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    custom: jest.fn(),
  },
}));

describe("ToastFeedback", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls toast.custom with correct content for type 'success'", () => {
    ToastFeedback({
      type: "success",
      title: "Success!",
      description: "Patient created successfully.",
    });

    expect(toast.custom).toHaveBeenCalledTimes(1);

    const toastRenderFn = (toast.custom as jest.Mock).mock.calls[0][0];
    const { container } = render(toastRenderFn());

    expect(container).toHaveTextContent("Success!");
    expect(container).toHaveTextContent("Patient created successfully.");
    expect(container.querySelector("svg")?.getAttribute("class")).toMatch(
      /text-green-600/
    );
  });

  it("calls toast.custom with correct content for type 'error'", () => {
    ToastFeedback({
      type: "error",
      title: "Error",
      description: "Something went wrong.",
    });

    const toastRenderFn = (toast.custom as jest.Mock).mock.calls[0][0];
    const { container } = render(toastRenderFn());

    expect(container).toHaveTextContent("Error");
    expect(container).toHaveTextContent("Something went wrong.");
    expect(container.querySelector("svg")?.getAttribute("class")).toMatch(
      /text-red-600/
    );
  });

  it("calls toast.custom with correct content for type 'info'", () => {
    ToastFeedback({
      type: "info",
      title: "Information",
      description: "Here is some info.",
    });

    const toastRenderFn = (toast.custom as jest.Mock).mock.calls[0][0];
    const { container } = render(toastRenderFn());

    expect(container).toHaveTextContent("Information");
    expect(container).toHaveTextContent("Here is some info.");
    expect(container.querySelector("svg")?.getAttribute("class")).toMatch(
      /text-blue-600/
    );
  });

  it("renders without title or description (graceful fallback)", () => {
    ToastFeedback({});

    const toastRenderFn = (toast.custom as jest.Mock).mock.calls[0][0];
    const { container } = render(toastRenderFn());

    expect(container).toBeInTheDocument();
    // Nothing is shown if title/description are missing
    expect(container).not.toHaveTextContent(/.+/);
  });
});
