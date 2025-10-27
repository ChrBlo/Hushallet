import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { MD3Theme, Surface, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import AvatarBubble from './avatar-bubble';
import { getAvatarConfig } from './get-avatar';
import StyledButton from './styled-button';
import { useHouseholdUpdate } from '../infra/hooks/use_household_update';
import { useSelectedHouseholdId } from '../providers/household_provider';
import { Household } from '../types/household';
import { auth } from '../firebase_client';

const MEMBERS_PER_ROW = 4;

interface HouseholdSettingsMemberProps {
  houseHold: Household;
}

function HouseholdSettingsMember({ houseHold }: HouseholdSettingsMemberProps) {
  const theme = useTheme();
  const householdUpdate = useHouseholdUpdate();
  const { setSelectedHouseholdId } = useSelectedHouseholdId();

  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 32;
  const gap = 16;
  const availableWidth = screenWidth - containerPadding;
  const totalGapWidth = gap * (MEMBERS_PER_ROW - 1);
  const itemWidth = Math.floor(
    (availableWidth - totalGapWidth) / MEMBERS_PER_ROW
  );
  const avatarSize = Math.min(itemWidth - 16, 80);

  const s = createStyles(theme, itemWidth);

  const handleLeaveHousehold = () => {
    Alert.alert(
      'Lämna hushåll',
      `Är du säker på att du vill lämna hushållet: "${houseHold.name}"?`,
      [
        {
          text: 'Nej',
          style: 'cancel',
        },
        {
          text: 'Ja',
          style: 'destructive',
          onPress: async () => {
            const currentUserId = auth.currentUser?.uid;
            if (!currentUserId) return;

            const updatedUsers = houseHold.users.filter(
              user => user.id !== currentUserId
            );

            const updatedHousehold = {
              ...houseHold,
              users: updatedUsers,
            };

            await householdUpdate.mutateAsync(updatedHousehold);

            setSelectedHouseholdId('');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={s.container}>
      <View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>Inbjudningskod</Text>
          <Surface style={s.invitationCodeContainer}>
            <Text style={s.invitationCode}>{houseHold.invitation_code}</Text>
          </Surface>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Medlemmar</Text>
          <View style={s.membersGrid}>
            {houseHold.users.map(user => (
              <View key={user.id} style={s.memberItem}>
                <AvatarBubble
                  config={getAvatarConfig(user.icon)}
                  size={avatarSize}
                  style={s.avatar}
                />
                <Text style={s.memberName}>{user.nickname}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={s.buttonContainer}>
        <StyledButton title="Lämna hushåll" onPress={handleLeaveHousehold} />
      </View>
    </View>
  );
}

const createStyles = (theme: MD3Theme, itemWidth: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
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
    invitationCodeContainer: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceVariant,
    },
    invitationCode: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontFamily: 'monospace',
    },
    membersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
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
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 20,
    },
  });

export default HouseholdSettingsMember;
