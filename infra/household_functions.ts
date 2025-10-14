import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase_client';
import type { Household, HouseholdWithTasks } from '../types/household';
import type { Task } from '../types/task';
import { requireCurrentUser } from './auth_functions';
import { normalizeDate } from './helpers/date';

const collectionName = 'households';

const householdGet = async (): Promise<HouseholdWithTasks[]> => {
  const user = requireCurrentUser();

  const householdSnapshot = await getDocs(collection(db, collectionName));

  const memberHouseholds = householdSnapshot.docs
    .map(householdDoc => {
      const data = householdDoc.data();

      return {
        id: householdDoc.id,
        created_by: data.created_by ?? '',
        name: data.name,
        invitation_code: data.invitation_code,
        users: (data.users ?? []) as Household['users'],
      };
    })
    .filter(household =>
      household.users.some(householdUser => householdUser.id === user.uid)
    );

  const householdsWithTasks = await Promise.all(
    memberHouseholds.map(async household => {
      if (!household.id) {
        return { household, tasks: [] };
      }

      const taskSnapshot = await getDocs(
        query(
          collection(db, 'tasks'),
          where('household_id', '==', household.id)
        )
      );

      const tasks = taskSnapshot.docs.map(taskDoc => {
        const data = taskDoc.data();

        return {
          id: taskDoc.id,
          title: data.title,
          description: data.description,
          created_date: normalizeDate(data.created_date),
          frequency: data.frequency,
          points: data.points,
          status: data.status,
          created_by: data.created_by ?? '',
          household_id: data.household_id ?? household.id,
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
      });

      return { household, tasks };
    })
  );

  return householdsWithTasks;
};

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

export { householdCreate, householdDelete, householdGet, householdUpdate };
