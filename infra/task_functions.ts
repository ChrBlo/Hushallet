import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase_client';
import { requireCurrentUser } from './auth_functions';
import { Task, TaskUpdate } from '../types/task';

const collectionName = 'tasks';

const createTask = async (
  task: Omit<Task, 'id' | 'created_by'>
): Promise<Task & { id: string }> => {
  const user = requireCurrentUser();
  if (!task.household_id) {
    throw new Error('createTask requires a household id');
  }

  const docRef = await addDoc(collection(db, collectionName), {
    title: task.title,
    description: task.description,
    created_date: task.created_date,
    execution_date: task.execution_date,
    frequency: task.frequency,
    status: task.status,
    created_by: user.uid,
    household_id: task.household_id,
    users: task.users ?? [],
  });

  return {
    ...task,
    created_by: user.uid,
    id: docRef.id,
  };
};

const getTask = async (taskId: string): Promise<Task & { id: string }> => {
  requireCurrentUser();
  const task = await getDoc(doc(db, collectionName, taskId));
  if (!task.exists()) {
    throw new Error(`Task ${taskId} not found`);
  }

  const data = task.data();
  return {
    id: taskId,
    title: data.title,
    description: data.description,
    created_date: data.created_date,
    execution_date: data.execution_date,
    frequency: data.frequency,
    status: data.status,
    created_by: data.created_by ?? '',
    household_id: data.household_id ?? '',
    users: (data.users ?? []) as Task['users'],
  };
};

const updateTask = async (
  taskId: string,
  updates: TaskUpdate
): Promise<void> => {
  requireCurrentUser();
  if (!Object.keys(updates).length) {
    return;
  }

  await updateDoc(doc(db, collectionName, taskId), updates);
};

export { createTask, getTask, updateTask };
