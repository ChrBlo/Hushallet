import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  IconButton,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import AvatarBubble from '../../components/avatar-bubble';
import HouseholdAvatarSelector from '../../components/household-avatar-selector';
import { getAvatarConfig, type AvatarName } from '../../components/get-avatar';
import { useHouseholdGet } from '../../infra/hooks/use_household';
import { useHouseholdUpdate } from '../../infra/hooks/use_household_update';
import { useSelectedHouseholdId } from '../../providers/household_provider';
import { auth } from '../../firebase_client';
import StyledButton from '../../components/styled-button';
import { signOutUser } from '../../infra/auth_functions';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const households = useHouseholdGet();
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const updateHousehold = useHouseholdUpdate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  const currentUser = selectedHousehold?.household.users?.find(
    u => u.id == auth.currentUser?.uid
  );

  useEffect(() => {
    if (currentUser && !isEditingName) {
      setNameInput(currentUser.nickname);
    }
  }, [currentUser?.nickname, isEditingName]);

  const handleLogOut = () => {
    signOutUser();
    router.replace('/');
  };

  const handleStartEditing = () => {
    if (!currentUser) {
      return;
    }

    setNameInput(currentUser.nickname);
    setIsEditingName(true);
  };

  const handleCancelEditing = () => {
    if (currentUser) {
      setNameInput(currentUser.nickname);
    }

    setIsEditingName(false);
  };

  const handleSaveName = async () => {
    if (!selectedHousehold?.household || !currentUser) {
      return;
    }

    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      Alert.alert('Ogiltigt namn', 'Namnet kan inte vara tomt.');
      return;
    }

    if (trimmedName === currentUser.nickname) {
      setIsEditingName(false);
      return;
    }

    try {
      const updatedUsers = selectedHousehold.household.users.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              nickname: trimmedName,
            }
          : user
      );

      await updateHousehold.mutateAsync({
        ...selectedHousehold.household,
        users: updatedUsers,
      });

      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update nickname', error);
      Alert.alert(
        'Kunde inte uppdatera',
        'Ett fel uppstod när namnet skulle sparas. Försök igen.'
      );
    }
  };

  const isSavingName = updateHousehold.isPending;
  const canSubmitName =
    !!currentUser &&
    nameInput.trim().length > 0 &&
    nameInput.trim() !== currentUser.nickname;

  const handleSelectIcon = async (icon: AvatarName) => {
    if (
      !selectedHousehold?.household ||
      !currentUser ||
      icon === currentUser.icon ||
      updateHousehold.isPending
    ) {
      return;
    }

    try {
      const updatedUsers = selectedHousehold.household.users.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              icon,
            }
          : user
      );

      await updateHousehold.mutateAsync({
        ...selectedHousehold.household,
        users: updatedUsers,
      });
    } catch (error) {
      console.error('Failed to update avatar', error);
      Alert.alert(
        'Kunde inte uppdatera',
        'Ett fel uppstod när avataren skulle sparas. Försök igen.'
      );
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileContent}>
          {isEditingName ? (
            <View style={styles.nameEditWrapper}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                style={styles.nameInput}
                mode="outlined"
                maxLength={24}
                autoFocus
                disabled={isSavingName}
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <View style={styles.editActions}>
                {isSavingName ? (
                  <ActivityIndicator
                    animating
                    size="small"
                    style={styles.editActionSpinner}
                  />
                ) : (
                  <IconButton
                    icon="check"
                    size={26}
                    onPress={handleSaveName}
                    accessibilityLabel="Spara namn"
                    disabled={!canSubmitName}
                    style={styles.editActionButton}
                  />
                )}
                <IconButton
                  icon="close"
                  size={26}
                  onPress={handleCancelEditing}
                  accessibilityLabel="Avbryt"
                  disabled={isSavingName}
                  style={styles.editActionButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <View style={styles.nameActionSlot} pointerEvents="none" />
              <View style={styles.nameCenter}>
                <Text style={styles.name}>{currentUser?.nickname}</Text>
              </View>
              <View style={styles.nameActionSlot}>
                <IconButton
                  icon="pencil"
                  size={28}
                  onPress={handleStartEditing}
                  accessibilityLabel="Redigera namn"
                  style={styles.editButton}
                  disabled={!currentUser}
                />
              </View>
            </View>
          )}
          <AvatarBubble
            config={getAvatarConfig(currentUser?.icon ?? 'octopus')}
            size={150}
            style={styles.avatar}
          />
          {selectedHousehold?.household && currentUser ? (
            <HouseholdAvatarSelector
              household={selectedHousehold.household}
              currentUserId={currentUser.id}
              selectedIcon={currentUser.icon}
              onSelect={handleSelectIcon}
              isSaving={updateHousehold.isPending}
            />
          ) : null}
        </View>

        <Text style={styles.emailText}>{auth.currentUser?.email ?? ''}</Text>

        <StyledButton
          title="Log Out"
          onPress={() => handleLogOut()}
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    profileContent: {
      alignItems: 'center',
      width: '100%',
    },
    avatar: {
      marginBottom: 16,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      alignSelf: 'center',
      width: '100%',
      maxWidth: 360,
    },
    nameCenter: {
      flex: 1,
      alignItems: 'center',
    },
    nameActionSlot: {
      width: 48,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nameEditWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
      marginBottom: 16,
      maxWidth: 360,
    },
    name: {
      fontSize: 50,
      fontWeight: 600,
      textAlign: 'center',
    },
    editButton: {
      margin: 0,
    },
    editActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameInput: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      marginRight: 8,
    },
    editActionButton: {
      margin: 0,
      marginLeft: 4,
    },
    editActionSpinner: {
      marginRight: 8,
    },
    logoutButton: {
      alignSelf: 'stretch',
    },
    emailText: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
      fontSize: 16,
    },
  });

export default ProfileScreen;
