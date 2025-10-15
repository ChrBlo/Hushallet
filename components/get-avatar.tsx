import type { Icon as AvatarName } from '../types/household_user';

type AvatarConfig = {
  emoji: string;
  color: string;
};

const avatarMap: Record<AvatarName, AvatarConfig> = {
  octopus: { emoji: '🦑', color: '#A855F7' },
  frog: { emoji: '🐸', color: '#4ADE80' },
  pig: { emoji: '🐷', color: '#F472B6' },
  unicorn: { emoji: '🦄', color: '#FDCB58' },
  chicken: { emoji: '🐔', color: '#F97316' },
  dolphin: { emoji: '🐬', color: '#38BDF8' },
  owl: { emoji: '🦉', color: '#FACC15' },
  fox: { emoji: '🦊', color: '#FB923C' },
};

const getAvatarConfig = (name: AvatarName): AvatarConfig =>
  avatarMap[name] ?? avatarMap.octopus;

export { avatarMap, getAvatarConfig };
export type { AvatarConfig, AvatarName };
