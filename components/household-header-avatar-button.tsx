import { router } from 'expo-router';
import { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import AvatarBubble from './avatar-bubble';
import { getAvatarConfig } from './get-avatar';
import { auth } from '../firebase_client';
import { useHouseholdGet } from '../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../providers/household_provider';

const HouseholdHeaderAvatarButton = () => {
  const theme = useTheme();
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const households = useHouseholdGet();
  const currentUser = auth.currentUser;

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  const currentMember = selectedHousehold?.household.users.find(
    u => u.id === currentUser?.uid
  );

  if (!selectedHousehold || !currentMember) {
    return null;
  }

  return (
    <TouchableOpacity
      accessibilityLabel="Visa profil"
      style={styles.button}
      onPress={() => router.push('/groups/profile')}
      hitSlop={8}
    >
      <AvatarBubble
        config={getAvatarConfig(currentMember.icon)}
        size={36}
        style={{
          borderWidth: theme.dark ? 1 : 0,
          borderColor: theme.colors.outlineVariant,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
  },
});

export default memo(HouseholdHeaderAvatarButton);
