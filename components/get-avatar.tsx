import { Text } from 'react-native';

export interface Avatar {
  avatar: 'fox' | 'octopus' | 'owl';
}

const getAvatar = (avatar: Avatar) => {
  if (avatar.avatar === 'fox') {
    return '🦊';
  } else if (avatar.avatar === 'octopus') {
    return '🦑';
  } else if (avatar.avatar === 'owl') {
    return '🦉';
  }
};

const AvatarIcon = ({ avatar }: Avatar) => {
  return <Text>{getAvatar({ avatar })}</Text>;
};

export default AvatarIcon;
