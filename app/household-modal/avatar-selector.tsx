import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { AvatarName, avatarMap } from '../../components/get-avatar';

type SimpleAvatarSelectorProps = {
  selectedIcon: AvatarName;
  unavailableIcons: Set<AvatarName>;
  onSelectIcon: (icon: AvatarName) => void;
};

export default function SimpleAvatarSelector({
  selectedIcon,
  unavailableIcons,
  onSelectIcon,
}: SimpleAvatarSelectorProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {Object.entries(avatarMap).map(([name, config]) => {
        const icon = name as AvatarName;
        const isSelected = icon === selectedIcon;
        const isUnavailable = unavailableIcons.has(icon);

        return (
          <TouchableOpacity
            key={icon}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              isUnavailable && !isSelected && styles.optionDisabled,
            ]}
            disabled={isUnavailable && !isSelected}
            onPress={() => onSelectIcon(icon)}
            accessibilityLabel={`Välj avatar ${config.emoji}`}
            accessibilityState={{
              disabled: isUnavailable && !isSelected,
              selected: isSelected,
            }}
          >
            <Text style={styles.emoji}>{config.emoji}</Text>
            <Text style={styles.label}>
              {icon.charAt(0).toUpperCase() + icon.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 12,
      gap: 8,
    },
    option: {
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 6,
      borderRadius: theme.roundness,
      borderWidth: 2,
      borderColor: 'transparent',
      minWidth: 72,
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer,
    },
    optionDisabled: {
      opacity: 0.4,
    },
    emoji: {
      fontSize: 32,
    },
    label: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
  });
