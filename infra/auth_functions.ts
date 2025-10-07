import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase_client';

const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

const signOutUser = () => signOut(auth);

const observeAuthChanges = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

const requireCurrentUser = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated');
  }
  return user;
};

export {
  requireCurrentUser,
  observeAuthChanges,
  registerWithEmail,
  signInWithEmail,
  signOutUser,
};
