import { AlertCircleIcon, AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertMessageProps {
  /**
   * The type of alert to display
   * @default "error"
   */
  variant?: "error" | "warning" | "success" | "info";
  /**
   * Optional title for the alert
   * If not provided, a default title based on the variant will be used
   */
  title?: string;
  /**
   * Optional description for the alert
   * If not provided, a default description based on the variant will be used
   */
  description?: string;
  /**
   * Optional array of additional messages to display as a list
   */
  messages?: string[];
  /**
   * Optional className for the root div
   */
  className?: string;
  /**
   * Optional max width for the alert
   * @default "max-w-xl"
   */
  maxWidth?: string;
}

const variantIcons = {
  error: AlertCircleIcon,
  warning: AlertTriangleIcon,
  success: CheckCircle2Icon,
  info: InfoIcon,
} as const;

const variantClasses = {
  error: "bg-red-50 text-red-700 border-red-200 [&>svg]:text-red-600",
  warning: "bg-amber-50 text-amber-700 border-amber-200 [&>svg]:text-amber-600",
  success: "bg-green-50 text-green-700 border-green-200 [&>svg]:text-green-600",
  info: "bg-blue-50 text-blue-700 border-blue-200 [&>svg]:text-blue-600",
} as const;

export function AlertMessage({
  variant = "error",
  title,
  description,
  messages = [],
  className = "",
  maxWidth = "max-w-xl",
}: AlertMessageProps) {
  const t = useTranslations("AlertMessage");
  const Icon = variantIcons[variant];
  
  // Get translated strings based on variant
  const defaultTitle = t(`${variant}.defaultTitle`);
  const defaultDescription = t(`${variant}.defaultDescription`);
  const variantTitle = t(`${variant}.title`);
  const variantDescription = t(`${variant}.description`);
  
  // Use provided title/description or fall back to translated defaults
  const alertTitle = title || variantTitle || defaultTitle;
  const alertDescription = description || (messages.length > 0 ? variantDescription : defaultDescription);

  return (
    <div className={`w-full ${maxWidth} ${className}`}>
      <Alert className={`${variantClasses[variant]} flex flex-col items-start gap-2`}>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="space-y-1.5">
            {alertTitle && <AlertTitle className="text-sm font-medium">{alertTitle}</AlertTitle>}
            {alertDescription && (
              <AlertDescription className="text-sm">
                <p>{alertDescription}</p>
                {messages.length > 0 && (
                  <ul className="mt-1.5 ml-4 list-disc space-y-1">
                    {messages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}
