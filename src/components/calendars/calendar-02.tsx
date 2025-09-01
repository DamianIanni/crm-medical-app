import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type CalendarProps = {
  className?: string;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  fromDate?: Date;
  toDate?: Date;
};

export default function Calendar02({
  className,
  selected,
  onSelect,
  disabled,
  fromDate = new Date(1900, 0, 1),
  toDate = new Date(2100, 11, 31),
}: CalendarProps) {
  const t = useTranslations("Calendar");
  const [date, setDate] = React.useState<Date | undefined>(selected);

  React.useEffect(() => {
    if (selected) {
      setDate(selected);
    }
  }, [selected]);

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    onSelect(today);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={(date) => {
          setDate(date);
          onSelect(date);
        }}
        disabled={disabled}
        fromDate={fromDate}
        toDate={toDate}
        className="rounded-lg border shadow-sm"
      />
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleToday}
        >
          {t("today")}
        </Button>
      </div>
    </div>
  );
}
