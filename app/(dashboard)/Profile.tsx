import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToStorage } from "../../services/entries";
import Loading from "../../components/Loading";
import { AuthContext } from "../../contexts/AuthContext";

export default function Profile() {
    const { user } = useContext(AuthContext);
    const auth = getAuth();
    const [photo, setPhoto] = useState<string | null>(user?.photoURL ?? null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
        if (!res.canceled && res.assets && res.assets.length > 0 && user) {
            const uri = res.assets[0].uri;
            setLoading(true);
            try {
                const downloadUrl = await uploadImageToStorage(uri, user.uid);
                await updateProfile(auth.currentUser!, { photoURL: downloadUrl });
                setPhoto(downloadUrl);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
    };

    if (loading) return <Loading />;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }} style={styles.avatar} />
            </TouchableOpacity>
            <Text style={styles.name}>{user?.displayName || "User"}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
    name: { fontSize: 18, fontWeight: "bold" },
    email: { color: "#666", marginBottom: 16 },
    button: { backgroundColor: "#007AFF", padding: 8, borderRadius: 8 },
    buttonText: { color: "#fff", fontWeight: "bold" },
});
