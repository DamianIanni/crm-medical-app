import { z } from "zod";

export const noteSchema = z.object({
  note: z.string().min(1, "Note is required"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
