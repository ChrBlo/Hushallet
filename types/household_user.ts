type HouseholdUser = {
  id: string;
  nickname: string;
  role: Role;
  icon: Icon;
  status: UserStatus;
};

type Role = 'admin' | 'member';
type UserStatus = 'active' | 'inactive' | 'requested';
type Icon =
  | 'octopus'
  | 'frog'
  | 'pig'
  | 'unicorn'
  | 'chicken'
  | 'dolphin'
  | 'fox'
  | 'owl';

export { HouseholdUser, Role, UserStatus as Status, Icon };
