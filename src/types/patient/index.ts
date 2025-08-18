export type Notes = {
  date: string; // ISO date;
  notes: string;
  id: string;
};

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string; // ISO date
  short_description: string;
  notes: Notes[];
};
