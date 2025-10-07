import { HouseholdUser } from './household_user';

type Household = {
  id?: string;
  created_by: string;
  name: string;
  invitation_code: string;
  users: HouseholdUser[];
};

export { type Household };
