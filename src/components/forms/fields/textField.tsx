import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

export type GenericTextFieldProps<FormValues extends FieldValues> = {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
  placeholder?: string;
  textArea?: boolean;
  textAreaRows?: number;
};

export function TextField<FormValues extends FieldValues>(
  props: GenericTextFieldProps<FormValues>
) {
  const {
    control,
    name,
    label,
    type = "text",
    disabled = false,
    textArea = false,
    textAreaRows = 3,
    placeholder = "",
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {textArea ? (
              <textarea
                className="flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={textAreaRows}
                disabled={disabled}
                placeholder={placeholder}
                {...field}
              />
            ) : (
              <Input
                className="bg-white"
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
