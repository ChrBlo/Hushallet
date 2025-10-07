import { HouseHoldUser } from './house_hold_user';

export type TaskUser = {
  user: HouseHoldUser;
  points: number;
  isDone: boolean;
};
