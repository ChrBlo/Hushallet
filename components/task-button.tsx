import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MD3Theme, Surface, useTheme } from 'react-native-paper';
import { getDaysSinceCompletion } from '../infra/helpers/get_days_since_completion';

interface Props {
  onPress: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  title: string;
  lastCompletionDate?: Date;
  taskCreatedDate?: Date;
  frequency?: number;
  isEditMode?: boolean;
  disabled?: boolean;
}

const getBadgeStyles = (daysSince: number, frequency: number) => {
  const isLate = daysSince > frequency;

  return {
    backgroundColor: isLate ? '#b33131ff' : '#dadadaff',
    textColor: isLate ? '#FFFFFF' : '#000000',
  };
};

export const TaskButton = ({
  onPress,
  onLongPress,
  title,
  children,
  lastCompletionDate,
  taskCreatedDate,
  frequency,
  isEditMode = false,
  disabled = false,
}: Props) => {
  const theme = useTheme();
  const s = createStyles(theme);
  const daysSince = getDaysSinceCompletion(lastCompletionDate, taskCreatedDate);
  const showBadge =
    !isEditMode &&
    daysSince !== null &&
    daysSince > 0 &&
    frequency !== undefined;
  const badgeStyles = showBadge ? getBadgeStyles(daysSince, frequency) : null;

  return (
    <>
      <TouchableOpacity
        style={s.outerContainer}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
      >
        <Surface style={[s.container, disabled && s.disabledContainer]}>
          <Text
            style={[s.textStyle, disabled && s.disabledText]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View style={s.rightContent}>
            {showBadge && badgeStyles && (
              <View
                style={[
                  s.badge,
                  { backgroundColor: badgeStyles.backgroundColor },
                ]}
              >
                <Text style={[s.badgeText, { color: badgeStyles.textColor }]}>
                  {daysSince}
                </Text>
              </View>
            )}
            {children}
          </View>
        </Surface>
      </TouchableOpacity>
    </>
  );
};

export default TaskButton;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: 60,
      backgroundColor: theme.colors.surface,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
    },
    disabledContainer: {
      opacity: 0.5,
      backgroundColor: theme.colors.surfaceDisabled,
    },
    outerContainer: {
      marginHorizontal: 8,
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    textStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginRight: -4,
    },
    disabledText: {
      color: theme.colors.onSurfaceDisabled,
    },
    rightContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    badge: {
      width: 28,
      height: 28,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  });
