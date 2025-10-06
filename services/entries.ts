import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    QueryDocumentSnapshot,
    onSnapshot,
    limit as limitFn,
    startAfter as startAfterFn,
    DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export type Entry = {
    id?: string;
    userId: string;
    mood: string;
    text?: string;
    imageUrl?: string | null;
    createdAt?: any;
};

export async function getEntriesForUser(userId: string): Promise<Entry[]> {
    const q = query(collection(db, "entries"), where("userId", "==", userId));
    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Entry[];
}

export async function uploadImageToStorage(uri: string, userId: string) {
    try {
        // fetch blob
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = `entries/${userId}/${Date.now()}.jpg`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    } catch (err) {
        console.error('uploadImageToStorage error', err);
        throw err;
    }
}

export async function addEntry(entry: Partial<Entry>) {
    const col = collection(db, 'entries');
    const docRef = await addDoc(col, { ...entry, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function updateEntry(id: string, payload: Partial<Entry>) {
    const docRef = doc(db, 'entries', id);
    await updateDoc(docRef, payload);
}

export async function deleteEntry(id: string) {
    await deleteDoc(doc(db, 'entries', id));
}

export function getEntriesListener(userId: string, onUpdate: (rows: Entry[]) => void) {
    const col = collection(db, 'entries');
    const q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
        const rows: Entry[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        onUpdate(rows);
    }, (err) => {
        console.error('getEntriesListener error', err);
        onUpdate([]);
    });
    return unsub;
}

export async function getEntriesPage(userId: string, pageSize = 10, lastDoc?: QueryDocumentSnapshot<DocumentData>) {
    const col = collection(db, 'entries');
    let q;
    if (lastDoc) {
        q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'), startAfterFn(lastDoc), limitFn(pageSize));
    } else {
        q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'), limitFn(pageSize));
    }
    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    const last = snap.docs[snap.docs.length - 1];
    return { docs, last };
}
