type HouseHoldUser = {
  id: string;
  nickname: string;
  role: Role;
  icon: Icon;
  points: number;
  status: UserStatus;
};

type Role = 'admin' | 'moderator' | 'member';
type UserStatus = 'active' | 'inactive' | 'requested';
type Icon =
  | 'octopus'
  | 'frog'
  | 'pig'
  | 'unicorn'
  | 'chicken'
  | 'dolphin'
  | 'owl';

export { HouseHoldUser, Role, UserStatus as Status, Icon };
