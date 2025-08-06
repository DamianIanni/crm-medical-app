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
import { toast } from "sonner";

type CenterFormProps = {
  mode?: "create" | "edit";
  data?: Partial<Center>;
};

export function CenterForm(props: CenterFormProps): React.ReactElement {
  const { mode, data } = props;
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      name: data?.name || "",
      phone: data?.phone || "",
      address: data?.address || "",
    },
  });

  async function onSubmit(values: {
    name: string;
    phone: string;
    address: string;
  }) {
    try {
      if (mode === "edit" && data?.id) {
        console.log("Updating center:", data.id, values);
        toast("Center updated successfully");
      } else {
        console.log("Creating center:", values);
        toast("Center created successfully");
      }
      router.replace("/centers");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Error submitting form");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full max-w-2xl mx-auto space-y-6")}
      >
        <div className="bg-card  rounded-lg p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <div className="grid gap-4">
                <TextField
                  control={form.control}
                  name="name"
                  label="Center Name"
                  placeholder="Enter center name"
                />
                <TextField
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                />
                <TextField
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="123 Main Street, City, State 12345"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-auto">
            {mode === "edit" ? "Save Changes" : "Create Center"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
