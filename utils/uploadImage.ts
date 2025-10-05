import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAsync = async (uri: string, userId: string) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `images/${userId}/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
};
