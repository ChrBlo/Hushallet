import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import AvatarBubble from './avatar-bubble';
import { getAvatarConfig } from './get-avatar';
import { HouseholdUser } from '../types/household_user';

interface MemberGridProps {
  members: HouseholdUser[];
  onMemberPress?: (memberId: string) => void;
  membersPerRow?: number;
  containerPadding?: number;
  gap?: number;
}

function MemberGrid({
  members,
  onMemberPress,
  membersPerRow = 4,
  containerPadding = 16,
  gap = 16,
}: MemberGridProps) {
  const theme = useTheme();

  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - containerPadding * 2;
  const totalGapWidth = gap * (membersPerRow - 1);
  const itemWidth = Math.floor(
    (availableWidth - totalGapWidth) / membersPerRow
  );
  const avatarSize = Math.min(itemWidth - 16, 80);

  const s = createStyles(theme, itemWidth, gap);

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Medlemmar</Text>
      <View style={s.membersGrid}>
        {members.map(user => {
          const content = (
            <>
              <AvatarBubble
                config={getAvatarConfig(user.icon)}
                size={avatarSize}
                style={s.avatar}
              />
              <Text style={s.memberName}>{user.nickname}</Text>
            </>
          );

          if (onMemberPress) {
            return (
              <TouchableOpacity
                key={user.id}
                style={s.memberItem}
                onPress={() => onMemberPress(user.id)}
              >
                {content}
              </TouchableOpacity>
            );
          }

          return (
            <View key={user.id} style={s.memberItem}>
              {content}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: MD3Theme, itemWidth: number, gap: number) =>
  StyleSheet.create({
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      marginBottom: 12,
      textAlign: 'center',
    },
    membersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: gap,
      justifyContent: 'center',
    },
    memberItem: {
      alignItems: 'center',
      width: itemWidth,
    },
    avatar: {
      marginBottom: 8,
    },
    memberName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
  });

export default MemberGrid;
