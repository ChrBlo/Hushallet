import type { Task } from './task';
import { HouseholdUser } from './household_user';

type Household = {
  id?: string;
  created_by: string;
  name: string;
  invitation_code: string;
  users: HouseholdUser[];
  user_ids?: string[];
};

type HouseholdWithTasks = {
  household: Household;
  tasks: Task[];
};

export { type Household, type HouseholdWithTasks };
