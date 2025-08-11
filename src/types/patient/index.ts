export type Session = {
  date: string;
  notes: string;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string; // ISO date
  treatment: string;
  sessionsCompleted: number;
  sessions: Session[];
};
