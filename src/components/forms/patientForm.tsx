/**
 * @file PatientForm.tsx
 * @summary This file defines the PatientForm component, a reusable form for creating and editing patient information.
 * It integrates with React Hook Form for form management and Zod for validation, handling data submission
 * to either create a new patient or update an existing one via custom hooks.
 */

"use client";

import { Button } from "@/components/ui/button";
import { patientSchema, PatientFormValues } from "@/lib/schemas/patientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreatePatient, useUpdatePatient } from "@/hooks/patient/usePatient";
import Calendar22 from "../calendars/calendar-22";
import Calendar32 from "../calendars/calendar-32";
import { Patient } from "@/types/patient";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { TextField } from "./fields/textField";
import { useIsMobile } from "@/hooks/use-mobile";

type PatientFormProps = {
  mode?: "create" | "edit";
  data?: Partial<Patient>;
};

/**
 * PatientForm component.
 * A versatile form component used for both adding new patient records and editing existing ones.
 * It dynamically adjusts its behavior and display based on the 'mode' prop.
 *
 * @param {PatientFormProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered form component.
 */
export function PatientForm(props: PatientFormProps): React.ReactElement {
  const { mode, data } = props;
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending; // Boolean indicating if the form is currently being submitted.
  const router = useRouter();
  const isMobile = useIsMobile();

  /**
   * Initializes the form with React Hook Form.
   * Configures form validation using Zod and sets default values based on the provided 'data' prop (for edit mode).
   */
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema), // Integrates Zod for schema validation.
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber || "",
      treatment: data?.treatment || "",
      dob: data?.dob || "",
    },
  });

  // const isSubmitting = form.formState.isSubmitting; // Boolean indicating if the form is currently being submitted.

  /**
   * Handles the form submission logic.
   * Depending on the 'mode' prop, it either calls the createPatient or updatePatient mutation.
   * After a successful operation, it redirects the user to the patients dashboard.
   * @param {PatientFormValues} values - The form values submitted by the user.
   */
  async function onSubmit(values: PatientFormValues) {
    if (mode === "edit" && data?.id) {
      await updatePatient.mutateAsync({
        id: data.id,
        updated: { ...values },
      });
    } else {
      await createPatient.mutateAsync({
        ...values,
        sessions: [], // Initialize sessions as an empty array for new patients.
        sessionsCompleted: 0, // Initialize sessions completed count to zero for new patients.
      });
    }
    router.replace("/dashboard/patients"); // Redirects to the patients list page.
  }

  return (
    <div
      className={cn(
        "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 relative"
      )}
      {...props}
    >
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        {mode === "edit" ? "Edit patient" : "Add new patient"}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        {mode === "edit"
          ? "Update the patient's information below."
          : "Fill out the form below to register a new patient."}
      </p>
      {/* Form component wrapping the native form for context provision */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-grow justify-between gap-6"
        >
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {/* Text field for the patient's first name */}
                <TextField
                  control={form.control}
                  name="firstName"
                  label="First name"
                  disabled={isPending}
                />
              </div>
              <div className="flex-1">
                {/* Text field for the patient's last name */}
                <TextField
                  control={form.control}
                  name="lastName"
                  label="Last name"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {/* Text field for the patient's email address */}
                <TextField
                  control={form.control}
                  name="email"
                  label="Email"
                  // type="email" // This can be uncommented to enforce email input type
                  disabled={isPending}
                />
              </div>
              <div className="flex-1">
                {/* Text field for the patient's phone number */}
                <TextField
                  control={form.control}
                  name="phoneNumber"
                  label="Phone number"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex-1">
              {/* Text field for the patient's treatment */}
              <TextField
                control={form.control}
                name="treatment"
                label="Treatment"
                disabled={isPending}
              />
            </div>

            <div className="flex w-full">
              {/* Conditionally renders calendar component based on device type */}
              {isMobile ? (
                <Calendar32 control={form.control} disabled={isPending} />
              ) : (
                <Calendar22 control={form.control} disabled={isPending} />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            {/* Submit button for the form */}
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
