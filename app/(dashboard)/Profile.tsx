import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { uploadImageAsync } from "../../utils/uploadImage";
import Loading from "../../components/Loading";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const auth = getAuth();
    const [photo, setPhoto] = useState<string | null>(user?.photoURL ?? null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && user) {
            const uri = result.assets[0].uri;
            setLoading(true);
            try {
                const downloadUrl = await uploadImageAsync(uri, user.uid);
                await updateProfile(auth.currentUser!, { photoURL: downloadUrl });
                setPhoto(downloadUrl);
            } catch (err) {
                console.error("Upload failed:", err);
            } finally {
                setLoading(false);
            }
        } else if (!user) {
            console.warn("User not found in AuthContext");
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
    };

    if (loading) return <Loading />;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                <Image
                    source={{
                        uri: photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    }}
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <Text style={styles.name}>{user?.displayName || "User"}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
    name: { fontSize: 20, fontWeight: "bold" },
    email: { fontSize: 16, color: "#666", marginBottom: 20 },
    button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 10 },
    buttonText: { color: "#fff", fontWeight: "bold" },
});

export default Profile;
