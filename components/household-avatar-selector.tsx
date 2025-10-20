import { memo, useMemo, useCallback } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import AvatarBubble from './avatar-bubble';
import { avatarMap, type AvatarName } from './get-avatar';
import { useSelectedHouseholdId } from '../providers/household_provider';
import { useHouseholdGet } from '../infra/hooks/use_household';
import { useHouseholdUpdate } from '../infra/hooks/use_household_update';

type HouseholdAvatarSelectorProps = {
  memberId: string;
};

const HouseholdAvatarSelector = ({
  memberId,
}: HouseholdAvatarSelectorProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const households = useHouseholdGet();
  const updateHousehold = useHouseholdUpdate();

  const selectedHousehold = households.data?.find(
    householdWithTasks =>
      householdWithTasks.household.id === selectedHouseholdId
  );

  const currentMember = selectedHousehold?.household.users.find(
    user => user.id === memberId
  );

  const unavailableIcons = useMemo(() => {
    if (!selectedHousehold || !currentMember) {
      return new Set<AvatarName>();
    }

    const taken = selectedHousehold.household.users
      .filter(user => user.id !== currentMember.id)
      .map(user => user.icon);

    return new Set<AvatarName>(taken);
  }, [selectedHousehold, currentMember]);

  const handleSelectIcon = useCallback(
    async (icon: AvatarName) => {
      if (
        !selectedHousehold ||
        !currentMember ||
        icon === currentMember.icon ||
        updateHousehold.isPending
      ) {
        return;
      }

      try {
        const updatedUsers = selectedHousehold.household.users.map(user =>
          user.id === currentMember.id
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
    },
    [selectedHousehold, currentMember, updateHousehold]
  );

  if (!selectedHousehold || !currentMember) {
    return null;
  }

  const selectedIcon = currentMember.icon;
  const isSaving = updateHousehold.isPending;

  return (
    <View style={styles.container}>
      {Object.entries(avatarMap).map(([name, config]) => {
        const icon = name as AvatarName;
        const isSelected = icon === selectedIcon;
        const isUnavailable = unavailableIcons.has(icon);
        const isDisabled = (isUnavailable && !isSelected) || !!isSaving;

        return (
          <TouchableOpacity
            key={icon}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              isDisabled && !isSelected && styles.optionDisabled,
            ]}
            disabled={isDisabled}
            onPress={() => handleSelectIcon(icon)}
            accessibilityLabel={`Välj avatar ${config.emoji}`}
            accessibilityState={{ disabled: isDisabled, selected: isSelected }}
          >
            <AvatarBubble config={config} size={64} />
            <Text style={styles.label}>
              {icon.charAt(0).toUpperCase() + icon.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 24,
    },
    option: {
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
      borderWidth: 2,
      borderColor: 'transparent',
      margin: 8,
      minWidth: 96,
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer,
    },
    optionDisabled: {
      opacity: 0.4,
    },
    label: {
      marginTop: 8,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
  });

export default memo(HouseholdAvatarSelector);
