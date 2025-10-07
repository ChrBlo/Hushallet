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
import type { Household } from '../types/household';
import type { Task } from '../types/task';

const collectionName = 'households';

const householdCreate = async (
  household: Omit<Household, 'id' | 'created_by'>
): Promise<Household> => {
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

const householdGet = async (householdId: string): Promise<Household> => {
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

const householdsForUserGet = async (): Promise<Household[]> => {
  const user = requireCurrentUser();

  const householdSnapshot = await getDocs(
    query(collection(db, collectionName), where('created_by', '==', user.uid))
  );

  return householdSnapshot.docs.map(householdDoc => {
    const data = householdDoc.data();

    return {
      id: householdDoc.id,
      created_by: data.created_by ?? user.uid,
      name: data.name,
      invitation_code: data.invitation_code,
      users: (data.users ?? []) as Household['users'],
    };
  });
};

const householdUpdate = async (household: Household): Promise<void> => {
  requireCurrentUser();

  if (!household.id) {
    throw new Error('householdUpdate requires an id');
  }

  const { id, created_by: _createdBy, ...fieldsToPersist } = household;

  const updates = Object.fromEntries(
    Object.entries(fieldsToPersist).filter(([, value]) => value !== undefined)
  ) as Partial<Omit<Household, 'id' | 'created_by'>>;

  if (!Object.keys(updates).length) {
    return;
  }

  await updateDoc(doc(db, collectionName, id), updates);
};

const householdDelete = async (householdId: string): Promise<void> => {
  requireCurrentUser();
  await deleteDoc(doc(db, collectionName, householdId));
};

const householdWithTasksGet = async (
  householdId: string
): Promise<{
  household: Household;
  tasks: Task[];
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
  householdsForUserGet,
  householdWithTasksGet,
  householdUpdate,
  householdDelete,
};
