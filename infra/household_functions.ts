import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase_client';
import { requireCurrentUser } from './auth_functions';
import { Household, HouseholdUpdate } from '../types/household';
import { Task } from '../types/task';

const collectionName = 'households';

const householdCreate = async (
  household: Omit<Household, 'id' | 'created_by'>
): Promise<Household & { id: string }> => {
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

const householdGet = async (
  householdId: string
): Promise<Household & { id: string }> => {
  requireCurrentUser();
  const snap = await getDoc(doc(db, collectionName, householdId));

  if (!snap.exists()) {
    throw new Error(`Household ${householdId} not found`);
  }

  const data = snap.data();

  return {
    id: householdId,
    created_by: data.created_by ?? '',
    name: data.name,
    invitation_code: data.invitation_code,
    users: (data.users ?? []) as Household['users'],
  };
};

const householdUpdate = async (
  householdId: string,
  updates: HouseholdUpdate
): Promise<void> => {
  requireCurrentUser();

  if (!Object.keys(updates).length) {
    return;
  }

  await updateDoc(doc(db, collectionName, householdId), updates);
};

const householdDelete = async (householdId: string): Promise<void> => {
  requireCurrentUser();
  await deleteDoc(doc(db, collectionName, householdId));
};

const householdWithTasksGet = async (
  householdId: string
): Promise<{
  household: Household & { id: string };
  tasks: Array<Task & { id: string }>;
}> => {
  requireCurrentUser();
  const household = await householdGet(householdId);

  const taskSnapshot = await getDocs(
    query(collection(db, 'tasks'), where('household_id', '==', householdId))
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
      household_id: data.household_id ?? householdId,
      users: (data.users ?? []) as Task['users'],
    };
  });

  return { household, tasks };
};

export {
  householdCreate,
  householdGet,
  householdWithTasksGet,
  householdUpdate,
  householdDelete,
};
