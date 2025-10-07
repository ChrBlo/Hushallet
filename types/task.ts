import { TaskUser } from './task_user';

type Task = {
  id?: string;
  created_by: string;
  household_id: string;
  title: string;
  description: string;
  created_date: Date;
  execution_date: Date | null;
  frequency: number;
  status: TaskStatus;
  users: TaskUser[];
};

type TaskStatus = 'active' | 'archived' | 'removed';

type TaskUpdate = Partial<Omit<Task, 'id'>>;

export { type Task, type TaskUpdate, type TaskStatus as Status };
