"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Control } from "react-hook-form";
import { PatientFormValues } from "@/lib/schemas/patientSchema";

type Calendar22Props = {
  control: Control<PatientFormValues>;
  disabled: boolean;
};

export default function Calendar22(props: Calendar22Props) {
  const { control, disabled } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <FormField
      control={control}
      name="dob"
      render={({ field }) => {
        const date = field.value ? new Date(field.value) : undefined;

        return (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Date of birth</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={disabled}
                    variant="outline"
                    id="dob"
                    className="w-full justify-between font-normal"
                  >
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                    <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  disabled={disabled}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      field.onChange(selectedDate.toISOString());
                      setOpen(false);
                    }
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
