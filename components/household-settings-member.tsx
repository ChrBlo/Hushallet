import { Alert, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import InvitationCodeDisplay from './invitation-code-display';
import MemberGrid from './member-grid';
import StyledButton from './styled-button';
import { useHouseholdUpdate } from '../infra/hooks/use_household_update';
import { useSelectedHouseholdId } from '../providers/household_provider';
import { Household } from '../types/household';
import { auth } from '../firebase_client';

interface HouseholdSettingsMemberProps {
  houseHold: Household;
}

function HouseholdSettingsMember({ houseHold }: HouseholdSettingsMemberProps) {
  const householdUpdate = useHouseholdUpdate();
  const { setSelectedHouseholdId } = useSelectedHouseholdId();

  const s = createStyles();

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
        <InvitationCodeDisplay invitationCode={houseHold.invitation_code} />
        <MemberGrid
          members={houseHold.users.filter(user => user.status !== 'requested')}
        />
      </View>

      <View style={s.buttonContainer}>
        <StyledButton title="Lämna hushåll" onPress={handleLeaveHousehold} />
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 20,
    },
  });

export default HouseholdSettingsMember;
