// src/i18n.ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "es"] as const;
type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  // Type assertion since we validate it immediately after
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as Locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
