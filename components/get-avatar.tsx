import type { Icon as AvatarName } from '../types/household_user';

type AvatarConfig = {
  emoji: string;
  color: string;
};

const avatarMap: Record<AvatarName, AvatarConfig> = {
  octopus: { emoji: '🦑', color: '#CD5D6F' },
  frog: { emoji: '🐸', color: '#4DBE31' },
  pig: { emoji: '🐷', color: '#FF87CF' },
  unicorn: { emoji: '🦄', color: '#BD3BF0' },
  chicken: { emoji: '🐥', color: '#FCD933' },
  dolphin: { emoji: '🐬', color: '#00AFC3' },
  owl: { emoji: '🦉', color: '#D08100' },
  fox: { emoji: '🦊', color: '#FF7E46' },
};

const getAvatarConfig = (name: AvatarName): AvatarConfig =>
  avatarMap[name] ?? avatarMap.octopus;

export { avatarMap, getAvatarConfig };
export type { AvatarConfig, AvatarName };
