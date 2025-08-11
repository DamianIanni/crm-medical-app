"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { centerSchema } from "@/lib/schemas/centerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { TextField } from "./fields/textField";
import { Center } from "@/types/center";

import { useCreateCenter, useUpdateCenter } from "@/hooks/center/useCenter";

type CenterFormProps = {
  mode?: "create" | "edit";
  data?: Center;
};

export function CenterForm(props: CenterFormProps): React.ReactElement {
  const { mode, data } = props;
  const router = useRouter();
  const createCenter = useCreateCenter();
  const updateCenter = useUpdateCenter();

  const center = data;

  const form = useForm({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      name: center?.name || "",
      phone: center?.phone || "",
      address: center?.address || "",
    },
  });

  async function onSubmit(values: {
    name: string;
    phone: string;
    address: string;
  }) {
    const mutation = mode === "edit" ? updateCenter : createCenter;
    const payload =
      mode === "edit" && center?.id
        ? { id: center.id, center: values }
        : values;

    try {
      // @ts-expect-error - This is a workaround for a type inference issue with the mutation hook
      await mutation.mutateAsync(payload);
      router.back();
    } catch (error) {
      console.error("Form submission error:", error);
      // The hook will display its own error toast
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full max-w-2xl mx-auto space-y-6")}
      >
        <div className="rounded-lg p-6 ">
          <div className="space-y-6">
            <div>
              <div className="grid gap-4">
                <TextField
                  control={form.control}
                  name="name"
                  label="Center Name"
                  placeholder="Enter center name"
                  disabled={createCenter.isPending || updateCenter.isPending}
                />
                <TextField
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                  disabled={createCenter.isPending || updateCenter.isPending}
                />
                <TextField
                  control={form.control}
                  name="address"
                  label="Address"
                  disabled={createCenter.isPending || updateCenter.isPending}
                  placeholder="123 Main Street, City, State 12345"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-6  px-6">
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={createCenter.isPending || updateCenter.isPending}
            >
              {createCenter.isPending || updateCenter.isPending ? (
                <span className="mr-2">Saving...</span>
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Create Center"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
