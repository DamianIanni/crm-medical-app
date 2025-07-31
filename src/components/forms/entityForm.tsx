/**
 * @file EntityForm.tsx
 * @summary This file exports the EntityForm component, a dynamic form selector that renders different
 * form components (e.g., PatientForm, MemberForm, LoginForm) based on the `formType` prop.
 * It acts as a central entry point for various entity-related forms within the application.
 */

import { LoginForm } from "./loginForm";
import { PatientForm } from "./patientForm";
import { MemberForm } from "./memberForm";

import { Center } from "@/types/center";
import { User } from "@/types/user";
import { Patient } from "@/types/patient";

type FormType = "patient" | "member" | "auth" | "center";

type EntityFormProps = {
  formType: FormType;
  mode?: "create" | "edit";
  data?: Partial<Patient | User | Center>;
};

/**
 * EntityForm component.
 * A highly reusable component that acts as a switch, rendering the appropriate form
 * (e.g., patient, member, or login) based on the `formType` prop. It passes `mode` and `data`
 * props to the specific form components when applicable.
 *
 * @param {EntityFormProps} { formType, mode, data } - Destructured props containing the form type, mode, and initial data.
 * @returns {React.ReactElement} The rendered specific form component.
 */
export function EntityForm({
  formType,
  mode,
  data,
}: EntityFormProps): React.ReactElement {
  switch (formType) {
    case "patient":
      return <PatientForm mode={mode} data={data as Partial<Patient>} />;
    case "member":
      return <MemberForm mode={mode} data={data as Partial<User>} />;
    case "auth":
    default:
      return <LoginForm />;
  }
}
