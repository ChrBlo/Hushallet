import { MD3Theme, useTheme } from 'react-native-paper';
import { HouseholdUser } from '../../types/household_user';
import { ScrollView, StyleSheet } from 'react-native';

interface Household {
  id?: string;
  created_by: string;
  name: string;
  invitation_code: string;
  users: HouseholdUser[];
}

const GroupsScreen = () => {
  const theme = useTheme();
  
  <ScrollView>

  </ScrollView>
};

const createStyles = (theme : MD3Theme) =>
  StyleSheet.create({
    
  })