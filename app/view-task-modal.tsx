import { useLocalSearchParams } from 'expo-router';
import { Task } from '../types/task';
import { Text } from 'react-native-paper';

export const ViewTaskModal = () => {
const params = useLocalSearchParams();
const s = params.taskId;
return
  <Text>{s}</Text>
}

export default ViewTaskModal;