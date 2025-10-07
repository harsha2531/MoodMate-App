import { addDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export type Entry = {
    id?: string;
    userId: string;
    mood: string;
    text?: string;
    imageUrl?: string | null;
    createdAt?: any;
};

export async function uploadImageToStorage(uri: string, userId: string) {
    // fetch blob from local uri
    const response = await fetch(uri);
    const blob = await response.blob();
    const filePath = `entries/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
}

export async function addEntry(entry: Partial<Entry>) {
    const col = collection(db, "entries");
    const docRef = await addDoc(col, { ...entry, createdAt: new Date() });
    return docRef.id;
}

export async function getEntriesForUser(userId: string) {
    const col = collection(db, "entries");
    const q = query(col, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
