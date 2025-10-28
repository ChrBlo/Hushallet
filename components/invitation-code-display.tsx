import { StyleSheet, View } from 'react-native';
import { MD3Theme, Surface, Text, useTheme } from 'react-native-paper';

interface InvitationCodeDisplayProps {
  invitationCode: string;
}

function InvitationCodeDisplay({ invitationCode }: InvitationCodeDisplayProps) {
  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Inbjudningskod</Text>
      <Surface style={s.invitationCodeContainer}>
        <Text style={s.invitationCode}>{invitationCode}</Text>
      </Surface>
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
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
  });

export default InvitationCodeDisplay;
