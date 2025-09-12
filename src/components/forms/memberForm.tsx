"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { getMemberSchema, MemberFormValues } from "@/lib/schemas/memberSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SelectField } from "./fields/selectField";
import { useRouter } from "next/navigation";
import { useCreateMember, useUpdateTeamMember } from "@/hooks/team/useTeam";
import { Form } from "@/components/ui/form";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { TextField } from "./fields/textField";
import { ROUTES } from "@/constants/routes";

// Options are built using translations inside the component

type MemberFormProps = {
  mode?: "create" | "edit";
  data?: DataUserFilter;
};

export function MemberForm(props: MemberFormProps): React.ReactElement {
  const { mode, data } = props;
  const router = useRouter();
  const createMember = useCreateMember();
  const updateMember = useUpdateTeamMember();
  const isPending = createMember.isPending || updateMember.isPending;
  const t = useTranslations("MemberForm");
  const v = useTranslations("ValidationErrors");

  const memberSchema = React.useMemo(() => getMemberSchema(v), [v]);

  const selectOptionList = React.useMemo(
    () => [
      { label: t("roleManager"), value: "manager" as const },
      { label: t("roleEmployee"), value: "employee" as const },
    ],
    [t]
  );
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: data?.email ?? "",
      role: data?.role ?? "manager",
    },
  });

  const sameRole = form.watch("role") === data?.role;

  async function editing(values: MemberFormValues) {
    try {
      await updateMember.mutateAsync({
        userId: data!.user_id!,
        updated: { role: values.role as "manager" | "employee" },
      });
      router.replace(ROUTES.team);
    } catch (error) {
      console.log(error);
    }
  }

  async function creating(values: MemberFormValues) {
    try {
      await createMember.mutateAsync({
        email: values.email,
        role: values.role as "manager" | "employee",
      });
      router.replace(ROUTES.team);
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(values: MemberFormValues) {
    if (mode === "edit" && data?.user_id) {
      await editing(values);
    } else if (mode === "create") {
      await creating(values);
    }
    // router.replace(ROUTES.team);
  }

  return (
    <div
      className={cn(
        "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 relative"
      )}
      {...props}
    >
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        {mode === "edit" ? t("editTitle") : t("createTitle")}
      </h2>
      <p className="text-muted-foreground mb-6 text-sm">
        {mode === "edit" ? t("editDescription") : t("createDescription")}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex h-[calc(90%)] flex-col justify-between gap-6")}
        >
          <div className="grid h-min-full grid-cols-1 gap-4 md:grid-cols-2">
            {mode === "create" && (
              <TextField
                control={form.control}
                name="email"
                label={t("emailLabel")}
                type="email"
                disabled={isPending}
              />
            )}

            <div className="md:col-span-2">
              <SelectField
                control={form.control}
                name="role"
                label={t("roleLabel")}
                options={selectOptionList}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || sameRole}>
              {mode === "edit" ? t("saveButton") : t("inviteButton")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
