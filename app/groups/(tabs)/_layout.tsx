import { Stack, Tabs } from 'expo-router';

function GroupTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="settings" options={{ title: 'Inställningar' }} />
      <Tabs.Screen name="index" options={{ title: 'Uppgifter' }} />
      <Tabs.Screen name="statistics" options={{ title: 'Statistik' }} />
      <Stack.Screen
        name="task-modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

export default GroupTabsLayout;
