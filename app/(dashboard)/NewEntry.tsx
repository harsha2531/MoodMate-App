// app/(dashboard)/NewEntry.tsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Snackbar, Title, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addEntry, uploadImageToStorage } from '../../services/entries';
import { AuthContext } from '../../contexts/AuthContext';
import MoodPicker from '../../components/MoodPicker';

export default function NewEntry() {
    const [mood, setMood] = useState('😊');
    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
    const { user } = useContext(AuthContext);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setSnack({ visible: true, message: 'Permission to access photos is required.' });
            return;
        }
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });
        if (!res.cancelled) setImageUri(res.uri);
    };

    const takePhoto = async () => {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
            setSnack({ visible: true, message: 'Camera permission required.' });
            return;
        }
        const res = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
        if (!res.cancelled) setImageUri(res.uri);
    };

    const save = async () => {
        if (!user) return setSnack({ visible: true, message: 'User not authenticated' });
        // validation: require text or image
        if (!text.trim() && !imageUri) {
            setSnack({ visible: true, message: 'Please add text or pick an image.' });
            return;
        }

        setLoading(true);
        try {
            let imageUrl: string | null = null;
            if (imageUri) {
                imageUrl = await uploadImageToStorage(imageUri, user.uid);
            }
            await addEntry({ userId: user.uid, mood, text: text.trim() || '', imageUrl });
            setText('');
            setImageUri(null);
            setSnack({ visible: true, message: 'Entry saved' });
        } catch (err: any) {
            console.error(err);
            setSnack({ visible: true, message: err.message || 'Failed to save' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <Title style={{ marginBottom: 12 }}>New Entry</Title>
                <MoodPicker value={mood} onChange={setMood} />
                <TextInput
                    label="Write your thoughts (optional)"
                    value={text}
                    onChangeText={setText}
                    multiline
                    mode="outlined"
                    style={{ marginTop: 12 }}
                />
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <Button mode="outlined" onPress={pickImage} style={{ marginRight: 8 }}>
                        Pick Image
                    </Button>
                    <Button mode="outlined" onPress={takePhoto}>
                        Take Photo
                    </Button>
                </View>

                {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: 220, marginTop: 12, borderRadius: 8 }} /> : null}

                <Button
                    mode="contained"
                    onPress={save}
                    style={{ marginTop: 16 }}
                    disabled={loading}
                    contentStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                    {loading ? <ActivityIndicator animating={true} /> : 'Save Entry'}
                </Button>

                <Snackbar visible={snack.visible} onDismiss={() => setSnack({ visible: false, message: '' })} duration={2500}>
                    {snack.message}
                </Snackbar>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});
