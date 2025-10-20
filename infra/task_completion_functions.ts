import { arrayRemove, arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase_client';
import type { TaskCompletion } from '../types/task_completion';

export const taskCompletionCreate = async (taskId: string, completion: TaskCompletion) => {
  
  const taskRef = doc(db, 'tasks', taskId);

  const firestoreCompletion = {
    household_member_id: completion.household_member_id,
    execution_date: Timestamp.fromDate(completion.execution_date),
  };

  await updateDoc(taskRef, {
    users: arrayUnion(firestoreCompletion),
  });
};