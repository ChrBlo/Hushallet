import { router } from "expo-router";
import { Button, View } from "react-native";

export default function LoginScreen() {

  return (
    <View>
      <Button title="groups" onPress={() => router.push('/groups')} />
    </View>
  )
}
