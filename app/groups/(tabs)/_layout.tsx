import { Tabs } from 'expo-router';

function GroupTabsLayout() {
  return (
    <Tabs screenOptions={{headerShown: false}}  >
      <Tabs.Screen name="settings" options={{ title: "Inställningar" }} />
      <Tabs.Screen name="index" options={{ title: "Uppgifter" }} />
      <Tabs.Screen name="statistics" options={{ title: "Statistik" }} />
    </Tabs>
  );
}

export default GroupTabsLayout;
