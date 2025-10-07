import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface JournalEntry {
    id?: string;
    userId: string;
    mood: string;
    content: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const journalService = {
    createEntry: async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newEntry = {
            ...entry,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'journalEntries'), newEntry);
        return { id: docRef.id, ...newEntry };
    },

    getUserEntries: async (userId: string) => {
        const q = query(
            collection(db, 'journalEntries'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
        })) as JournalEntry[];
    },

    updateEntry: async (entryId: string, updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>) => {
        const entryRef = doc(db, 'journalEntries', entryId);
        await updateDoc(entryRef, {
            ...updates,
            updatedAt: Timestamp.now(),
        });
    },

    deleteEntry: async (entryId: string) => {
        await deleteDoc(doc(db, 'journalEntries', entryId));
    },

    getAllEntries: async () => {
        const querySnapshot = await getDocs(collection(db, 'journalEntries'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
        })) as JournalEntry[];
    },
};