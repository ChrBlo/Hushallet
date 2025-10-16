import { memo, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import AvatarBubble from './avatar-bubble';
import { avatarMap, type AvatarName } from './get-avatar';
import type { Household } from '../types/household';

type HouseholdAvatarSelectorProps = {
  household: Household;
  currentUserId: string;
  selectedIcon?: AvatarName;
  onSelect: (icon: AvatarName) => void;
  isSaving?: boolean;
};

const HouseholdAvatarSelector = ({
  household,
  currentUserId,
  selectedIcon,
  onSelect,
  isSaving,
}: HouseholdAvatarSelectorProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const unavailableIcons = useMemo(() => {
    const taken = household.users
      .filter(user => user.id !== currentUserId)
      .map(user => user.icon);

    return new Set<AvatarName>(taken);
  }, [household.users, currentUserId]);

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
            onPress={() => onSelect(icon)}
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
