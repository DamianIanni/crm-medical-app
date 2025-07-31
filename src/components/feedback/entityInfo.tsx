"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User } from "@/types/user";
import { Patient } from "@/types/patient";
import { useAuth } from "../providers/AuthProvider";
import Actions from "../tables/actions";

type Props = {
  data: Partial<User | Patient>;
};

export default function EntityInfo(props: Props) {
  const { data } = props;
  const { user } = useAuth();

  if (!data) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No entity data available.
      </div>
    );
  }
  const isPatient = "treatment" in data;
  const canSeeSessions = user?.role === "admin" || user?.role === "manager";

  const commonDetails = isPatient
    ? [
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phoneNumber },
        { label: "Date of Birth", value: data.dob },
      ]
    : [{ label: "Email", value: data.email }];

  const patientDetails = isPatient
    ? [
        { label: "Treatment", value: data.treatment },
        {
          label: "Sessions Completed",
          value: String(data.sessionsCompleted ?? 0),
        },
      ]
    : [];

  return (
    <div className="w-full max-w-2xl h-full flex flex-col rounded-xl p-6 relative">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="mb-1 text-2xl font-bold tracking-tight">
            {data.firstName} {data.lastName}
          </h3>
          <Actions
            route={isPatient ? "patients" : "team"}
            data={data!}
            inInfo
          />
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          ID: {data.id}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {[...commonDetails, ...patientDetails].map((item) => (
          <div
            key={item.label}
            className="flex flex-wrap md:flex-nowrap justify-between items-center border-b pb-1 last:border-none"
          >
            <p className="text-muted-foreground min-w-[120px] text-sm font-medium leading-none">
              {item.label}
            </p>
            <p className="break-words text-right w-full md:w-auto text-sm font-medium leading-none">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {isPatient && canSeeSessions && Array.isArray(data.sessions) && (
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="sessions">
            <AccordionTrigger>Show session notes</AccordionTrigger>
            <AccordionContent>
              {data.sessions.map((session, idx) => (
                <div key={idx} className="mb-4 space-y-1">
                  <p className=" text-muted-foreground text-sm font-medium leading-none">
                    {session.date}
                  </p>
                  <p className="text-sm leading-5">{session.notes}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
