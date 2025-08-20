"use client";

import React, { useState } from "react";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

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
import { cn } from "@/lib/utils";

type Calendar22Props = {
  control: Control<PatientFormValues>;
  disabled: boolean;
};

export default function Calendar22(props: Calendar22Props) {
  const { control, disabled } = props;
  const [open, setOpen] = useState<boolean>(false);
  const t = useTranslations('Calendar');
  return (
    <FormField
      control={control}
      name="date_of_birth"
      render={({ field }) => {
        const date = field.value ? new Date(field.value) : undefined;

        return (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>{t('dateOfBirth')}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={disabled}
                    variant="outline"
                    id="date_of_birth"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>{t('selectDate')}</span>
                    )}
                    <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      field.onChange(today.toISOString());
                      setOpen(false);
                    }}
                  >
                    {t('today')}
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    field.onChange(date?.toISOString());
                    setOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
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
