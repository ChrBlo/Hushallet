import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MD3Theme, Surface, useTheme } from 'react-native-paper';
import { getDaysSinceCompletion } from '../infra/helpers/get_days_since_completion';

interface Props {
  onPress: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  title: string;
  lastCompletionDate?: Date;
  frequency: number;
}

const getBadgeColor = (daysSince: number, frequency: number): string => {
  if (daysSince < frequency)
  {
    return '#67c06aff';
  }
  else if (daysSince === frequency)
  {
    return '#e6a646ff';
  }
  else
  {
    return '#e75050ff';
  }
};

export const TaskButton = ({
  onPress,
  onLongPress,
  title,
  children,
  lastCompletionDate,
  frequency,
}: Props) => {

  const s = createStyles(useTheme());
  const daysSince = getDaysSinceCompletion(lastCompletionDate);
  const showBadge = daysSince !== null && daysSince > 0;

  return (
    <>
      <TouchableOpacity
        style={s.outerContainer}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <Surface style={s.container}>
          <Text style={s.textStyle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={s.rightContent}>
            {showBadge && (
              <View
                style={[
                  s.badge,
                  { backgroundColor: getBadgeColor(daysSince, frequency) },
                ]}
              >
                <Text style={s.badgeText}>{daysSince}</Text>
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
