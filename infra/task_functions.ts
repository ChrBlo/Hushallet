import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase_client';
import type { Task } from '../types/task';
import { requireCurrentUser } from './auth_functions';
import { normalizeDate } from './helpers/date';

const collectionName = 'tasks';

const taskCreate = async (
  task: Omit<Task, 'id' | 'created_by'>
): Promise<Task> => {
  const user = requireCurrentUser();

  if (!task.household_id) {
    throw new Error('taskCreate requires a household id');
  }

  const docRef = await addDoc(collection(db, collectionName), {
    title: task.title,
    description: task.description,
    created_date: task.created_date,
    frequency: task.frequency,
    points: task.points,
    status: task.status,
    created_by: user.uid,
    household_id: task.household_id,
    users: task.completions ?? [],
  });

  return {
    ...task,
    created_by: user.uid,
    id: docRef.id,
  };
};

const taskGet = async (taskId: string): Promise<Task> => {
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
    created_date: normalizeDate(data.created_date),
    frequency: data.frequency,
    points: data.points,
    status: data.status,
    created_by: data.created_by ?? '',
    household_id: data.household_id ?? '',
    completions: (data.users ?? []).map(
      (completion: {
        household_member_id: string;
        execution_date?: unknown;
      }) => ({
        household_member_id: completion.household_member_id,
        execution_date: normalizeDate(completion.execution_date),
      })
    ),
  };
};

const taskUpdate = async (task: Task): Promise<void> => {
  requireCurrentUser();

  if (!task.id) {
    throw new Error('taskUpdate requires an id');
  }

  const { id, created_by: _createdBy, ...fieldsToPersist } = task;

  const updates = Object.fromEntries(
    Object.entries(fieldsToPersist).filter(([, value]) => value !== undefined)
  ) as Partial<Omit<Task, 'id' | 'created_by'>>;

  if (!Object.keys(updates).length) {
    return;
  }

  await updateDoc(doc(db, collectionName, id), updates);
};

const taskDelete = async (taskId: string): Promise<void> => {
  requireCurrentUser();
  await deleteDoc(doc(db, collectionName, taskId));
};

export { taskCreate, taskDelete, taskGet, taskUpdate };
