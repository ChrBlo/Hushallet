import { HouseholdUser } from './household_user';

type Household = {
  id?: string;
  created_by: string;
  name: string;
  invitation_code: string;
  users: HouseholdUser[];
};

type HouseholdUpdate = Partial<
  Pick<Household, 'name' | 'invitation_code' | 'users'>
>;

export { type Household, type HouseholdUpdate };
