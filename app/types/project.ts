export type Status = 'active' | 'on hold' | 'completed';

export type Project = {
  id: string;
  name: string;
  status: Status;
  deadline: string | null;
  assigned_member: string | null;
  budget: number | null;
};