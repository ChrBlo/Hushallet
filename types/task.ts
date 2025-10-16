import { TaskCompletion } from './task_completion';

type Task = {
  id?: string;
  created_by: string;
  household_id: string;
  title: string;
  description: string;
  created_date: Date;
  frequency: number;
  points: number;
  status: TaskStatus;
  completions: TaskCompletion[];
};

type TaskStatus = 'active' | 'archived' | 'removed';

export { type TaskStatus as Status, type Task };
