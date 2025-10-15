import { StyleSheet, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import AvatarBubble from '../../components/avatar-bubble';
import { getAvatarConfig } from '../../components/get-avatar';
import { useHouseholdGet } from '../../infra/hooks/use_household';
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

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  const currentUser = selectedHousehold?.household.users?.find(
    u => u.id == auth.currentUser?.uid
  );

  const handleLogOut = () => {
    signOutUser();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{currentUser?.nickname}</Text>
      <AvatarBubble
        config={getAvatarConfig(currentUser?.icon ?? 'octopus')}
        size={150}
      />
      <StyledButton title="Log Out" onPress={() => handleLogOut()} />
    </View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    name: {
      fontSize: 50,
      fontWeight: 600,
      padding: 10,
    },
  });

export default ProfileScreen;
