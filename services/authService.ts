import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const authService = {
    register: async (email: string, password: string, fullName: string, role: 'user' | 'admin' = 'user') => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            fullName,
            role,
            createdAt: new Date(),
        });

        return userCredential.user;
    },


    login: async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    logout: async () => {
        await signOut(auth);
    },
};