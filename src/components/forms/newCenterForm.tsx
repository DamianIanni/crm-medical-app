"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { TextField } from "./fields/textField";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { centerSchema, CenterSchemaType } from "@/lib/schemas/centerSchema";
import { Center } from "@/types/center";

export type CenterFormValues = CenterSchemaType;

type CenterFormProps = {
  mode?: "create" | "edit";
  data?: Partial<Center>;
};

/**
 * NewCenterForm component.
 * A versatile form component used for both adding new centers and editing existing ones.
 * It dynamically adjusts its behavior and display based on the 'mode' prop.
 *
 * @param {CenterFormProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered form component.
 */
export function NewCenterForm(props: CenterFormProps): React.ReactElement {
  const { mode, data } = props;
  
  const router = useRouter();

  /**
   * Initializes the form with React Hook Form.
   * Configures form validation using Zod and sets default values based on the provided data.
   */
  const form = useForm<CenterFormValues>({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      name: data?.name || "",
      phone: data?.phone || "",
      address: data?.address || "",
    },
  });

  // The data is passed as props, no need to fetch - same as patientForm
  // When in edit mode, the data prop contains the center information

  /**
   * Handles the form submission logic.
   * Depending on the 'mode', it either creates or updates a center.
   * After a successful operation, it redirects the user to the centers page.
   * @param {CenterFormValues} values - The form values submitted by the user.
   */
  async function onSubmit(values: CenterFormValues) {
    try {
      if (mode === "edit" && data?.id) {
        console.log("Updating center:", data.id, values);
        // await updateCenter({ id: data.id, ...values });
        toast("Center updated successfully");
      } else {
        console.log("Creating center:", values);
        // await createCenter(values);
        toast("Center created successfully");
      }
      router.replace("/centers");
    } catch (error) {
      console.error("Failed to save center:", error);
      toast("Failed to save center");
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 relative"
      )}
      {...props}
    >
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        {mode === "edit" ? "Edit center" : "Add new center"}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        {mode === "edit"
          ? "Update the center's information below."
          : "Fill out the form below to register a new center."}
      </p>
      {/* Form component wrapping the native form for context provision */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-grow justify-between gap-6"
        >
          <div className="space-y-6">
            <div className="flex-1">
              {/* Text field for the center name */}
              <TextField
                control={form.control}
                name="name"
                label="Center name"
                placeholder="Enter center name"
              />
            </div>

            <div className="flex-1">
              {/* Text field for the center phone */}
              <TextField
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="flex-1">
              {/* Text field for the center address */}
              <TextField
                control={form.control}
                name="address"
                label="Address"
                placeholder="Enter full address"
              />
            </div>
          </div>

          <div className="flex justify-end">
            {/* Submit button for the form */}
            <Button
              className="hover:cursor-pointer"
              type="submit"
            >
              {mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
