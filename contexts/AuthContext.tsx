import React, { createContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  role: "admin" | "user" | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  signOutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // fetch role from Firestore users collection
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            const data = snap.data() as any;
            setRole((data.role as "admin" | "user") ?? "user");
          } else {
            setRole("user");
          }
        } catch (err) {
          setRole("user");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async ({ email, password, firstName, lastName }: any) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    // create user doc
    await setDoc(doc(db, "users", uid), {
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      role: "user",
      createdAt: new Date(),
    });
    // Note: createUserWithEmailAndPassword signs the user in automatically
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
      <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOutUser }}>
        {children}
      </AuthContext.Provider>
  );
};
