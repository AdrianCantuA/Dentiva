import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../lib/firebase";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
