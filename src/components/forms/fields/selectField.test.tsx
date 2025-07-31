// SelectField.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectField } from "./selectField";

// Zod schema
const schema = z.object({
  country: z.string().nonempty("Country is required"),
});

type FormValues = z.infer<typeof schema>;

const options = [
  { label: "Argentina", value: "ar" },
  { label: "United Kingdom", value: "uk" },
  { label: "Denmark", value: "dk" },
];

function Wrapper() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: "" },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(() => {})}>
        <SelectField
          control={methods.control}
          name="country"
          label="Country"
          placeholder="Select your country"
          options={options}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("SelectField", () => {
  it("renders the label and placeholder", () => {
    render(<Wrapper />);
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("Select your country")).toBeInTheDocument();
  });

  it("shows the selected option after user selects one", async () => {
    render(<Wrapper />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("Denmark"));
    expect(screen.getByText("Denmark")).toBeInTheDocument();
  });

  it("shows validation error if no option is selected and form is submitted", async () => {
    render(<Wrapper />);
    await userEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText("Country is required")).toBeInTheDocument();
  });
});
