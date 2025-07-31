// src/components/ui/textField.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./textField";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema ficticio para testear validación
const schema = z.object({
  name: z.string().min(2, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

function TestForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <TextField control={methods.control} name="name" label="Name" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("TextField", () => {
  it("renders and accepts input", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<TestForm onSubmit={handleSubmit} />);

    const input = screen.getByLabelText("Name");
    await user.type(input, "Damian");

    expect(input).toHaveValue("Damian");
  });

  it("shows validation error when empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<TestForm onSubmit={handleSubmit} />);
    const button = screen.getByText("Submit");

    await user.click(button);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
