import { HouseHoldUser } from './house_hold_user';

type HouseHold = {
  id?: string;
  created_by: string;
  name: string;
  invitation_code: string;
  users: HouseHoldUser[];
};

type HouseHoldUpdate = Partial<
  Pick<HouseHold, 'name' | 'invitation_code' | 'users'>
>;

export { type HouseHold, type HouseHoldUpdate };
