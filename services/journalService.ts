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
        try {
            const newEntry = {
                ...entry,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, 'journalEntries'), newEntry);
            return {
                id: docRef.id,
                ...newEntry,
                createdAt: newEntry.createdAt.toDate(),
                updatedAt: newEntry.updatedAt.toDate(),
            };
        } catch (error: any) {
            console.error('Error creating entry:', error);
            throw new Error(`Failed to create entry: ${error.message}`);
        }
    },

    getUserEntries: async (userId: string): Promise<JournalEntry[]> => {
        try {
            const q = query(
                collection(db, 'journalEntries'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const entries: JournalEntry[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                entries.push({
                    id: doc.id,
                    userId: data.userId,
                    mood: data.mood,
                    content: data.content,
                    imageUrl: data.imageUrl,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                });
            });

            return entries;
        } catch (error: any) {
            console.error('Error fetching user entries:', error);
            // Check if it's a permission error or index error
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check Firestore rules.');
            } else if (error.code === 'failed-precondition') {
                throw new Error('Firestore index required. Please create the composite index.');
            } else {
                throw new Error(`Failed to load entries: ${error.message}`);
            }
        }
    },

    updateEntry: async (entryId: string, updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>) => {
        try {
            const entryRef = doc(db, 'journalEntries', entryId);
            await updateDoc(entryRef, {
                ...updates,
                updatedAt: Timestamp.now(),
            });
        } catch (error: any) {
            console.error('Error updating entry:', error);
            throw new Error(`Failed to update entry: ${error.message}`);
        }
    },

    deleteEntry: async (entryId: string) => {
        try {
            await deleteDoc(doc(db, 'journalEntries', entryId));
        } catch (error: any) {
            console.error('Error deleting entry:', error);
            throw new Error(`Failed to delete entry: ${error.message}`);
        }
    },

    getAllEntries: async (): Promise<JournalEntry[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, 'journalEntries'));
            const entries: JournalEntry[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                entries.push({
                    id: doc.id,
                    userId: data.userId,
                    mood: data.mood,
                    content: data.content,
                    imageUrl: data.imageUrl,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                });
            });

            return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error: any) {
            console.error('Error fetching all entries:', error);
            throw new Error(`Failed to load entries: ${error.message}`);
        }
    },
};



// import {
//     collection,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     doc,
//     getDocs,
//     getDoc,
//     query,
//     where,
//     orderBy,
//     Timestamp
// } from 'firebase/firestore';
// import { db } from '../firebase';
//
// export interface JournalEntry {
//     id?: string;
//     userId: string;
//     mood: string;
//     content: string;
//     imageUrl?: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
//
// export const journalService = {
//     createEntry: async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
//         const newEntry = {
//             ...entry,
//             createdAt: Timestamp.now(),
//             updatedAt: Timestamp.now(),
//         };
//
//         const docRef = await addDoc(collection(db, 'journalEntries'), newEntry);
//         return { id: docRef.id, ...newEntry };
//     },
//
//     getUserEntries: async (userId: string) => {
//         const q = query(
//             collection(db, 'journalEntries'),
//             where('userId', '==', userId),
//             orderBy('createdAt', 'desc')
//         );
//
//         const querySnapshot = await getDocs(q);
//         return querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//             createdAt: doc.data().createdAt.toDate(),
//             updatedAt: doc.data().updatedAt.toDate(),
//         })) as JournalEntry[];
//     },
//
//     updateEntry: async (entryId: string, updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>) => {
//         const entryRef = doc(db, 'journalEntries', entryId);
//         await updateDoc(entryRef, {
//             ...updates,
//             updatedAt: Timestamp.now(),
//         });
//     },
//
//     deleteEntry: async (entryId: string) => {
//         await deleteDoc(doc(db, 'journalEntries', entryId));
//     },
//
//     getAllEntries: async () => {
//         const querySnapshot = await getDocs(collection(db, 'journalEntries'));
//         return querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//             createdAt: doc.data().createdAt.toDate(),
//             updatedAt: doc.data().updatedAt.toDate(),
//         })) as JournalEntry[];
//     },
// };