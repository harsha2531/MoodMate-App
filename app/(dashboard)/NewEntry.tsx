import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, Platform, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, Title, Snackbar, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToStorage, addEntry } from "../../services/entries";
import { AuthContext } from "../../contexts/AuthContext";

export default function NewEntry() {
    const [mood, setMood] = useState("😊");
    const [text, setText] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
    const { user } = useContext(AuthContext);

    const pickImage = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            setSnack({ visible: true, message: "Permission required" });
            return;
        }
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });
        if (!res.canceled && res.assets && res.assets.length > 0) {
            setImageUri(res.assets[0].uri);
        }
    };

    const save = async () => {
        if (!user) return setSnack({ visible: true, message: "Not authenticated" });
        if (!text.trim() && !imageUri) return setSnack({ visible: true, message: "Add text or image" });

        setLoading(true);
        try {
            let imageUrl: string | null = null;
            if (imageUri) {
                imageUrl = await uploadImageToStorage(imageUri, user.uid);
            }
            await addEntry({ userId: user.uid, mood, text: text.trim(), imageUrl, createdAt: new Date() });
            setText("");
            setImageUri(null);
            setSnack({ visible: true, message: "Saved" });
        } catch (err: any) {
            console.error(err);
            setSnack({ visible: true, message: "Save failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.container}>
                <Title>New Entry</Title>

                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8 }}>
                    <Button mode="outlined" onPress={() => setMood("😊")}>😊</Button>
                    <Button mode="outlined" onPress={() => setMood("😢")}>😢</Button>
                    <Button mode="outlined" onPress={() => setMood("😡")}>😡</Button>
                    <Button mode="outlined" onPress={() => setMood("😌")}>😌</Button>
                </View>

                <TextInput label="Thoughts (optional)" value={text} onChangeText={setText} multiline style={{ marginTop: 12 }} />

                <View style={{ flexDirection: "row", marginTop: 12 }}>
                    <Button mode="outlined" onPress={pickImage} style={{ marginRight: 8 }}>Pick Image</Button>
                </View>

                {imageUri ? <Image source={{ uri: imageUri }} style={{ width: "100%", height: 200, marginTop: 12 }} /> : null}

                <Button mode="contained" onPress={save} disabled={loading} style={{ marginTop: 16 }}>
                    {loading ? <ActivityIndicator animating size={20} /> : "Save Entry"}
                </Button>

                <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, message: "" })} duration={2500}>
                    {snack.message}
                </Snackbar>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
