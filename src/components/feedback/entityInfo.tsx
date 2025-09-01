"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Patient } from "@/types/patient";
import Actions from "../tables/actions";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { ActionDialog } from "./actionDialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateNote, useDeleteNote } from "@/hooks/patient/usePatient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getNoteSchema, type NoteFormValues } from "@/lib/schemas/noteSchema";

interface Note {
  id: string;
  date: string;
  note: string;
}

interface UserData
  extends Omit<DataUserFilter, "center_id" | "center_name" | "status"> {
  center_name?: string;
  status?: string;
  [key: string]: unknown; // For any additional properties
}

interface PatientData extends Omit<Patient, "notes"> {
  center_id?: string;
  treatment?: string;
  notes?: Note[];
}

type EntityData = UserData | PatientData;

type EntityType = "user" | "patient";

interface EntityInfoProps {
  data: EntityData | null;
  type: EntityType;
  onEdit?: () => void;
  id?: string;
}

// Helper type guard to check if data is PatientData
function isPatientData(data: EntityData): data is PatientData {
  return "phone" in data && "date_of_birth" in data;
}

export default function EntityInfo({
  data: initialData,
  type,
  id,
}: EntityInfoProps) {
  const [data, setData] = useState<EntityData | null>(initialData);
  const isPatient = type === "patient";
  const patientId = isPatient ? id || (data?.id as string) || "" : "";

  const t = useTranslations("EntityInfo");
  const v = useTranslations("ValidationErrors");

  const noteSchema = useMemo(() => getNoteSchema(v), [v]);
  // Call hooks unconditionally but pass empty string when not a patient
  const { mutate: createNote, isPending: isCreatingNote } =
    useCreateNote(patientId);
  const { mutate: deleteNote, isPending: isDeletingNote } =
    useDeleteNote(patientId);

  // Wrapper functions that check if we have a patient ID before proceeding
  const handleCreateNote = (values: NoteFormValues) => {
    if (!patientId || !data || !isPatientData(data)) return;

    createNote(values, {
      onSuccess: () => {
        const newNote: Note = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          note: values.note,
        };
        setData({
          ...data,
          notes: [newNote, ...(data.notes || [])],
        });
      },
    });
  };

  const handleDeleteNote = (noteId: string) => {
    if (!patientId || !data || !isPatientData(data)) return;

    deleteNote(noteId, {
      onSuccess: () => {
        setData({
          ...data,
          notes: data.notes?.filter((note) => note.id !== noteId) || [],
        });
      },
    });
  };

  const onSubmit = (values: NoteFormValues) => {
    if (!isPatient) return;
    handleCreateNote(values);
    form.reset();
  };

  const handleDeleteNoteClick = (noteId: string) => {
    handleDeleteNote(noteId);
  };

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema), // Integrates Zod for schema validation.
    defaultValues: {
      note: "",
    },
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        {t("noData", { type: t(`types.${type}`) })}
      </div>
    );
  }

  // Common details for both user and patient
  const commonDetails = [{ label: t("fields.email"), value: data.email }];

  // User specific details
  const userDetails = !isPatient
    ? [
        { label: t("fields.role"), value: (data as UserData).role },
        {
          label: t("fields.status"),
          value: (data as UserData).status
            ? t(`statuses.${(data as UserData).status?.toLowerCase()}`)
            : "",
        },
        { label: t("fields.center"), value: (data as UserData).center_name },
      ]
    : [];

  // Patient specific details
  const patientDetails = isPatient
    ? [
        { label: t("fields.phone"), value: (data as PatientData).phone },
        {
          label: t("fields.dateOfBirth"),
          value: (data as PatientData).date_of_birth?.split("T")[0],
        },
        {
          label: t("fields.diagnose"),
          value: (data as PatientData).short_description,
        },
      ]
    : [];

  const allDetails = [
    ...commonDetails,
    ...(isPatient ? patientDetails : userDetails),
  ];

  // onEdit handler is passed directly to Actions component
  return (
    <div className="w-full h-full flex flex-col rounded-xl p-6  relative">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="mb-1 text-2xl font-bold tracking-tight">
            {data.first_name} {data.last_name}
          </h3>
          {data && (
            <>
              {isPatient ? (
                <Actions
                  route="patients"
                  data={{
                    id: String(data.id || ""),
                    first_name: String(data.first_name || ""),
                    last_name: String(data.last_name || ""),
                    email: String(data.email || ""),
                    phone: String((data as PatientData).phone || ""),
                    date_of_birth: String(
                      (data as PatientData).date_of_birth || ""
                    ),
                    short_description: String(
                      (data as PatientData).short_description || ""
                    ),
                  }}
                  inInfo
                />
              ) : (
                <Actions
                  route="team"
                  data={{
                    user_id:
                      "user_id" in data
                        ? String(data.user_id)
                        : String(data.id || ""),
                    first_name: String(data.first_name || ""),
                    last_name: String(data.last_name || ""),
                    email: String(data.email || ""),
                    role: (data as UserData).role || ("employee" as const),
                    status: (data as UserData).status || "active",
                    center_id: String((data as UserData).center_id || ""),
                    center_name: String((data as UserData).center_name || ""),
                  }}
                  inInfo
                />
              )}
            </>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("fields.id")}: {"user_id" in data ? data.user_id : data.id}
          </span>
          {!isPatient && (data as UserData).center_name && (
            <span className="text-sm text-muted-foreground">
              {t("fields.center")}: {(data as UserData).center_name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {allDetails.map((item) => (
          <div
            key={item.label}
            className="flex flex-wrap md:flex-nowrap justify-between items-center border-b pb-2 last:border-none"
          >
            <p className="text-muted-foreground min-w-[140px] text-sm font-medium">
              {item.label}:
            </p>
            <p className="break-words text-right w-full md:w-auto text-sm font-medium">
              {item.value || "-"}
            </p>
          </div>
        ))}
      </div>

      {isPatient && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-between gap-6"
          >
            {/* Textarea with embedded submit icon */}
            <div className="relative">
              <textarea
                {...form.register("note")}
                rows={3}
                disabled={isCreatingNote || isDeletingNote}
                placeholder={t("notePlaceholder")}
                className="flex w-full min-h-12 rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isCreatingNote || isDeletingNote}
                className="absolute bottom-2 right-2 h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}

      {isPatient && isPatientData(data) && data.notes?.length ? (
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="sessions">
            <AccordionTrigger>
              {t("notes")} ({data.notes?.length || 0})
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {data.notes.map((note, index) => (
                <div key={note.id} className="p-3 pr-0 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-md font-medium text-muted-foreground">
                      {new Date(note.date).toLocaleDateString()} - {t("note")}{" "}
                      {data.notes!.length - index}
                    </span>
                    <ActionDialog
                      title={`${t("deleteNote")} - ${t("note")} ${
                        data.notes!.length - index
                      }`}
                      description={t("confirmDelete")}
                      onConfirm={() => handleDeleteNoteClick(note.id)}
                      confirmLabel={t("deleteNote")}
                      cancelLabel={t("cancel")}
                    />
                  </div>
                  <p className="text-md max-w-4xl">{note.note}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </div>
  );
}
