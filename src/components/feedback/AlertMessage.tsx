import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertMessageProps {
  title?: string;
  description?: string;
  data?: string[];
}

export function AlertMessage(props: AlertMessageProps) {
  const { title, description, data } = props;
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert variant="destructive">
        <AlertCircleIcon />
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && (
          <AlertDescription>
            <p>{description}</p>
            <ul className="list-inside list-disc text-sm">
              {data?.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          </AlertDescription>
        )}
      </Alert>
    </div>
  );
}
