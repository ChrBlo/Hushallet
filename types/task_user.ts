import { HouseholdUser } from './household_user';

export type TaskUser = {
  user: HouseholdUser;
  points: number;
  isDone: boolean;
};
