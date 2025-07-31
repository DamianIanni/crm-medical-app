"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { memberSchema, MemberFormValues } from "@/lib/schemas/memberSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SelectField } from "./fields/selectField";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useCreateMember, useUpdateTeamMember } from "@/hooks/team/useTeam";
import { Form } from "@/components/ui/form";
import { TextField } from "./fields/textField";
import { OverlayLoader } from "../loaders/loader";
import { ROUTES } from "@/constants/routes";

const selectOptionList = [
  { label: "Manager", value: "manager" },
  { label: "Employee", value: "employee" },
];

type MemberFormProps = {
  mode?: "create" | "edit";
  data?: Partial<User>;
};

export function MemberForm(props: MemberFormProps): React.ReactElement {
  const { mode, data } = props;
  const router = useRouter();
  const createMember = useCreateMember();
  const updatePatient = useUpdateTeamMember();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      role:
        (data?.role as "manager" | "employee" | "admin" | undefined) ||
        "manager",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: MemberFormValues) {
    if (mode === "edit" && data?.id) {
      updatePatient.mutate({
        id: data.id,
        updated: { ...values },
      });
    } else {
      createMember.mutate({
        ...values,

        firstName: "",
        lastName: "",
        organization: "",
      });
    }
    router.replace(ROUTES.team);
  }

  return (
    <div
      className={cn(
        "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 relative"
      )}
      {...props}
    >
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        {mode === "edit" ? "Edit team member" : "Add new team member"}
      </h2>
      <p className="text-muted-foreground mb-6 text-sm">
        {mode === "edit"
          ? "Update memeber's information below."
          : "Fill out the form below to invite a new member."}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex h-[calc(90%)] flex-col justify-between gap-6")}
        >
          <div className="grid h-min-full grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
            />

            <div className="md:col-span-2">
              <SelectField
                control={form.control}
                name="role"
                label="Role"
                options={selectOptionList}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {mode === "edit" ? "Save changes" : "Invite"}
            </Button>
          </div>
        </form>
      </Form>
      {isSubmitting && <OverlayLoader />}
    </div>
  );
}
