// services/entries.ts
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Entry } from '../types';

export async function addEntry(entry: Partial<Entry>) {
    const col = collection(db, 'entries');
    const docRef = await addDoc(col, { ...entry, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function getEntriesForUser(userId: string) {
    const q = query(collection(db, 'entries'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export async function updateEntry(id: string, payload: Partial<Entry>) {
    const docRef = doc(db, 'entries', id);
    await updateDoc(docRef, payload);
}

export async function deleteEntry(id: string) {
    await deleteDoc(doc(db, 'entries', id));
}
