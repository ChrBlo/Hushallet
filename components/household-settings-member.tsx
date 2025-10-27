import { View, Text } from 'react-native';
import { Household } from '../types/household';

interface HouseholdSettingsMemberProps {
  houseHold: Household;
}

function HouseholdSettingsMember({ houseHold }: HouseholdSettingsMemberProps) {
  return (
    <View>
      <Text>Household Settings Member Component</Text>
      <Text>Household Name: {houseHold.name}</Text>
      <Text>Household Inv: {houseHold.invitation_code}</Text>
    </View>
  );
}

export default HouseholdSettingsMember;
