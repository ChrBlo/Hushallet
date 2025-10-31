import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(houseHold.name);

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

  const handleRenameHousehold = async () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      Alert.alert('Ogiltigt namn', 'Hushållets namn kan inte vara tomt.');
      return;
    }

    if (trimmedName === houseHold.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateHousehold.mutateAsync({
        ...houseHold,
        name: trimmedName,
      });
      setIsEditingName(false);
      Alert.alert(
        'Namnbyte lyckades',
        `Hushållet har döpts om till "${trimmedName}".`
      );
    } catch (error) {
      console.error('Failed to rename household', error);
      Alert.alert(
        'Kunde inte byta namn',
        'Ett fel uppstod när hushållet skulle döpas om. Försök igen.'
      );
      setEditedName(houseHold.name);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(houseHold.name);
    setIsEditingName(false);
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

  const handleDeclineRequest = async (userId: string) => {
    if (!selectedHousehold?.household) return;

    const requestUser = selectedHousehold.household.users.find(
      u => u.id === userId
    );

    if (!requestUser) return;

    Alert.alert(
      'Avböj förfrågan',
      `Är du säker på att du vill avböja ${requestUser.nickname}s förfrågan? Användaren kommer att tas bort från hushållet.`,
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Avböj',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedUsers = selectedHousehold.household.users.filter(
                user => user.id !== userId
              );

              await updateHousehold.mutateAsync({
                ...selectedHousehold.household,
                users: updatedUsers,
              });

              Alert.alert('Avböjd', 'Förfrågan har avböjts.');
            } catch (error) {
              console.error('Failed to decline request', error);
              Alert.alert(
                'Kunde inte avböja',
                'Ett fel uppstod när förfrågan skulle avböjas. Försök igen.'
              );
            }
          },
        },
      ]
    );
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

  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <View style={s.container}>
      <View>
        {/* Household Name Editor */}
        <View style={s.nameSection}>
          {isEditingName ? (
            <View style={s.nameEditContainer}>
              <TextInput
                style={s.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Hushållets namn"
                maxLength={50}
                autoFocus
              />
              <View style={s.nameButtonsRow}>
                <StyledButton
                  title="Avbryt"
                  onPress={handleCancelEdit}
                  style={s.nameButton}
                />
                <StyledButton
                  title="Spara"
                  onPress={handleRenameHousehold}
                  style={s.nameButton}
                />
              </View>
            </View>
          ) : (
            <StyledButton
              title={`Byt namn: ${houseHold.name}`}
              onPress={() => setIsEditingName(true)}
              style={s.renameButton}
            />
          )}
        </View>

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
        onDeclineRequest={handleDeclineRequest}
        isProcessing={updateHousehold.isPending}
      />
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
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
    nameSection: {
      marginBottom: 16,
    },
    renameButton: {
      marginBottom: 0,
    },
    nameEditContainer: {
      gap: 12,
    },
    nameInput: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      color: theme.colors.onSurface,
    },
    nameButtonsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    nameButton: {
      flex: 1,
    },
  });

export default HouseholdSettingsAdmin;
