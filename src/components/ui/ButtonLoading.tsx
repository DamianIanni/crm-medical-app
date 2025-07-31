import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ButtonLoadingProp {
  text: string;
}

export function ButtonLoading(props: ButtonLoadingProp) {
  const { text } = props;
  return (
    <Button size="sm" disabled>
      <Loader2Icon className="animate-spin" />
      {text}
    </Button>
  );
}
