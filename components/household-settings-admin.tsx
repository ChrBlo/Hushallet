import { View, Text } from 'react-native';
import { Household } from '../types/household';

interface HouseholdSettingsAdminProps {
  houseHold: Household;
}

function HouseholdSettingsAdmin({ houseHold }: HouseholdSettingsAdminProps) {
  return (
    <View>
      <Text>Household Settings Admin Component</Text>
      <Text>Household Name: {houseHold.name}</Text>
      <Text>Household Inv: {houseHold.invitation_code}</Text>
    </View>
  );
}

export default HouseholdSettingsAdmin;
