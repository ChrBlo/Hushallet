import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase_client';
import { requireCurrentUser } from './auth_functions';
import { HouseHold, HouseHoldUpdate } from '../types/house_hold';
import { Task } from '../types/task';

const collectionName = 'households';

const createHouseHold = async (
  household: Omit<HouseHold, 'id' | 'created_by'>
): Promise<HouseHold & { id: string }> => {
  const user = requireCurrentUser();

  const docRef = await addDoc(collection(db, collectionName), {
    created_by: user.uid,
    name: household.name,
    invitation_code: household.invitation_code,
    users: household.users ?? [],
  });

  return {
    ...household,
    created_by: user.uid,
    id: docRef.id,
  };
};

const getHouseHold = async (
  houseHoldId: string
): Promise<HouseHold & { id: string }> => {
  requireCurrentUser();
  const snap = await getDoc(doc(db, collectionName, houseHoldId));
  if (!snap.exists()) {
    throw new Error(`Household ${houseHoldId} not found`);
  }

  const data = snap.data();
  return {
    id: houseHoldId,
    created_by: data.created_by ?? '',
    name: data.name,
    invitation_code: data.invitation_code,
    users: (data.users ?? []) as HouseHold['users'],
  };
};

const updateHouseHold = async (
  houseHoldId: string,
  updates: HouseHoldUpdate
): Promise<void> => {
  requireCurrentUser();
  if (!Object.keys(updates).length) {
    return;
  }

  await updateDoc(doc(db, collectionName, houseHoldId), updates);
};

const getHouseHoldWithTasks = async (
  houseHoldId: string
): Promise<{
  household: HouseHold & { id: string };
  tasks: Array<Task & { id: string }>;
}> => {
  requireCurrentUser();
  const household = await getHouseHold(houseHoldId);

  const taskSnapshot = await getDocs(
    query(collection(db, 'tasks'), where('house_hold_id', '==', houseHoldId))
  );

  const tasks = taskSnapshot.docs.map(taskDoc => {
    const data = taskDoc.data();
    return {
      id: taskDoc.id,
      title: data.title,
      description: data.description,
      created_date: data.created_date,
      execution_date: data.execution_date,
      frequency: data.frequency,
      status: data.status,
      created_by: data.created_by ?? '',
      house_hold_id: data.house_hold_id ?? houseHoldId,
      users: (data.users ?? []) as Task['users'],
    };
  });

  return { household, tasks };
};

export {
  createHouseHold,
  getHouseHold,
  getHouseHoldWithTasks,
  updateHouseHold,
};
