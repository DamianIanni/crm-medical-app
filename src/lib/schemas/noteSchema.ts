import * as z from "zod";

export const getNoteSchema = (t: (key: string) => string) =>
  z.object({
    note: z.string().min(1, t("noteContentRequired")),
  });

export type NoteFormValues = z.infer<ReturnType<typeof getNoteSchema>>;
