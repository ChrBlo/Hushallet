import { Tabs } from 'expo-router';

function GroupTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
}

export default GroupTabsLayout;
