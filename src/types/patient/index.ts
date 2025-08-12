export type Session = {
  date: string;
  notes: string;
};

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string; // ISO date
  treatment: string;
  sessionsCompleted: number;
  sessions: Session[];
};
