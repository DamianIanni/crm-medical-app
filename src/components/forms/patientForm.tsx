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
  data?: Patient;
};

export function PatientForm(props: PatientFormProps): React.ReactElement {
  const { mode, data } = props;
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending; // Boolean indicating if the form is currently being submitted.
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema), // Integrates Zod for schema validation.
    defaultValues: {
      first_name: data?.first_name ?? "",
      last_name: data?.last_name ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      short_description: data?.short_description ?? "",
      date_of_birth: data?.date_of_birth ?? "",
    },
  });

  async function onSubmit(values: PatientFormValues) {
    if (mode === "edit" && data?.id) {
      await updatePatient.mutateAsync({
        patientId: data.id,
        updated: { ...values },
      });
    } else {
      await createPatient.mutateAsync(values);
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
                  name="first_name"
                  label="First name"
                  disabled={isPending}
                />
              </div>
              <div className="flex-1">
                {/* Text field for the patient's last name */}
                <TextField
                  control={form.control}
                  name="last_name"
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
                  name="phone"
                  label="Phone number"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex-1">
              {/* Text field for the patient's treatment */}
              <TextField
                control={form.control}
                name="short_description"
                label="Diagnose"
                disabled={isPending}
                // textArea
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
