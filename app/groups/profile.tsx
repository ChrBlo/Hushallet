import { StyleSheet, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import AvatarBubble from '../../components/avatar-bubble';
import { getAvatarConfig } from '../../components/get-avatar';

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <AvatarBubble config={getAvatarConfig('octopus')} size={150} />
      <Text variant="headlineMedium">Profil</Text>
      <Text variant="bodyMedium">Här kommer profilinställningar senare.</Text>
    </View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 24,
    },
  });

export default ProfileScreen;
