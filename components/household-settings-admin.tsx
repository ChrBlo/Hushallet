import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import InvitationCodeDisplay from './invitation-code-display';
import MemberGrid from './member-grid';
import MemberEditModal from './member-edit-modal';
import JoinRequestsModal from './join-requests-modal';
import StyledButton from './styled-button';
import { Household } from '../types/household';
import { useHouseholdUpdate } from '../infra/hooks/use_household_update';
import { useHouseholdDelete } from '../infra/hooks/use_household_delete';
import { useHouseholdGet } from '../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../providers/household_provider';
import { auth } from '../firebase_client';

interface HouseholdSettingsAdminProps {
  houseHold: Household;
}

function HouseholdSettingsAdmin({ houseHold }: HouseholdSettingsAdminProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const updateHousehold = useHouseholdUpdate();
  const deleteHousehold = useHouseholdDelete();
  const households = useHouseholdGet();
  const { selectedHouseholdId, setSelectedHouseholdId } =
    useSelectedHouseholdId();

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  const selectedMember = selectedHousehold?.household.users.find(
    u => u.id === selectedMemberId
  );

  const handleCloseModal = () => {
    setSelectedMemberId(null);
  };

  const handleSaveName = async (newName: string) => {
    if (!selectedHousehold?.household || !selectedMember) {
      return;
    }

    try {
      const updatedUsers = selectedHousehold.household.users.map(user =>
        user.id === selectedMember.id
          ? {
              ...user,
              nickname: newName,
            }
          : user
      );

      await updateHousehold.mutateAsync({
        ...selectedHousehold.household,
        users: updatedUsers,
      });
    } catch (error) {
      console.error('Failed to update nickname', error);
      Alert.alert(
        'Kunde inte uppdatera',
        'Ett fel uppstod när namnet skulle sparas. Försök igen.'
      );
    }
  };

  const handleToggleAdmin = () => {
    if (!selectedHousehold?.household || !selectedMember) {
      return;
    }

    const isOwner =
      selectedHousehold.household.created_by === selectedMember.id;
    const isCurrentlyAdmin = selectedMember.role === 'admin';

    // Prevent demoting the creator
    if (isOwner && isCurrentlyAdmin) {
      Alert.alert(
        'Kan inte ta bort ägare',
        `${selectedMember.nickname} är ägare av hushållet och kan inte degraderas till medlem.`
      );
      return;
    }

    Alert.alert(
      isCurrentlyAdmin ? 'Ta bort admin' : 'Ge admin',
      isCurrentlyAdmin
        ? `Är du säker på att du vill ta bort admin-rättigheter från ${selectedMember.nickname}?`
        : `Är du säker på att du vill ge admin-rättigheter till ${selectedMember.nickname}?`,
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Ja',
          onPress: async () => {
            try {
              const updatedUsers = selectedHousehold.household.users.map(
                user =>
                  user.id === selectedMember.id
                    ? {
                        ...user,
                        role: isCurrentlyAdmin
                          ? ('member' as const)
                          : ('admin' as const),
                      }
                    : user
              );

              await updateHousehold.mutateAsync({
                ...selectedHousehold.household,
                users: updatedUsers,
              });
            } catch (error) {
              console.error('Failed to update role', error);
              Alert.alert(
                'Kunde inte uppdatera',
                'Ett fel uppstod när rollen skulle ändras. Försök igen.'
              );
            }
          },
        },
      ]
    );
  };

  const handleAcceptRequest = async (userId: string) => {
    if (!selectedHousehold?.household) return;

    try {
      const updatedUsers = selectedHousehold.household.users.map(user =>
        user.id === userId
          ? {
              ...user,
              status: 'active' as const,
            }
          : user
      );

      await updateHousehold.mutateAsync({
        ...selectedHousehold.household,
        users: updatedUsers,
      });

      Alert.alert('Accepterad', 'Användaren har lagts till i hushållet.');
    } catch (error) {
      console.error('Failed to accept request', error);
      Alert.alert(
        'Kunde inte acceptera',
        'Ett fel uppstod när förfrågan skulle accepteras. Försök igen.'
      );
    }
  };

  const handleLeaveHousehold = () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId || !houseHold.id) return;

    const isOwner = houseHold.created_by === currentUserId;

    if (isOwner) {
      Alert.alert(
        'Ta bort hushåll',
        `Du är ägare av hushållet "${houseHold.name}". Om du lämnar kommer hela hushållet att tas bort för alla medlemmar. Är du säker?`,
        [
          {
            text: 'Nej',
            style: 'cancel',
          },
          {
            text: 'Ja',
            style: 'destructive',
            onPress: async () => {
              await deleteHousehold.mutateAsync(houseHold.id!);
              setSelectedHouseholdId('');
              router.back();
            },
          },
        ]
      );
    } else {
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
              const updatedUsers = houseHold.users.filter(
                user => user.id !== currentUserId
              );

              const updatedHousehold = {
                ...houseHold,
                users: updatedUsers,
              };

              await updateHousehold.mutateAsync(updatedHousehold);
              setSelectedHouseholdId('');
              router.back();
            },
          },
        ]
      );
    }
  };

  const pendingRequests = houseHold.users.filter(
    user => user.status === 'requested'
  );

  const s = createStyles();

  return (
    <View style={s.container}>
      <View>
        {pendingRequests.length > 0 && (
          <StyledButton
            title={`Förfrågningar (${pendingRequests.length})`}
            onPress={() => setShowRequestsModal(true)}
            style={s.requestsButton}
          />
        )}
        <InvitationCodeDisplay invitationCode={houseHold.invitation_code} />
        <MemberGrid
          members={houseHold.users.filter(user => user.status !== 'requested')}
          onMemberPress={setSelectedMemberId}
        />
      </View>

      <View style={s.buttonContainer}>
        <StyledButton
          title={
            houseHold.created_by === auth.currentUser?.uid
              ? 'Ta bort hushåll'
              : 'Lämna hushåll'
          }
          onPress={handleLeaveHousehold}
        />
      </View>

      {selectedHousehold && (
        <MemberEditModal
          visible={selectedMemberId !== null}
          member={selectedMember ?? null}
          household={selectedHousehold.household}
          onClose={handleCloseModal}
          onSaveName={handleSaveName}
          onToggleAdmin={handleToggleAdmin}
          isSaving={updateHousehold.isPending}
        />
      )}

      <JoinRequestsModal
        visible={showRequestsModal}
        requests={pendingRequests}
        onClose={() => setShowRequestsModal(false)}
        onAcceptRequest={handleAcceptRequest}
        isProcessing={updateHousehold.isPending}
      />
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
    requestsButton: {
      marginBottom: 16,
    },
  });

export default HouseholdSettingsAdmin;
