import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addEntry } from '../../services/entries';
import { AuthContext } from '../../contexts/AuthContext';

export default function NewEntry() {
    const [mood, setMood] = useState('😊');
    const [text, setText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });
        if (!res.cancelled) setImageUri(res.uri);
    };

    const save = async () => {
        if (!user) return alert('Not authenticated');
        // For brevity we skip uploading image to storage here. In production: upload then store imageUrl.
        await addEntry({ userId: user.uid, mood, text, imageUrl: imageUri || null });
        setText('');
        setImageUri(null);
        alert('Saved');
    };

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 8 }}>
                <Button mode="outlined" onPress={() => setMood('😊')}>😊</Button>
                <Button mode="outlined" onPress={() => setMood('😢')}>😢</Button>
                <Button mode="outlined" onPress={() => setMood('😡')}>😡</Button>
                <Button mode="outlined" onPress={() => setMood('😌')}>😌</Button>
            </View>
            <TextInput label="Write your thoughts" value={text} onChangeText={setText} multiline />
            <Button onPress={pickImage} style={{ marginTop: 8 }}>Pick Image</Button>
            {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 8 }} /> : null}
            <Button mode="contained" onPress={save} style={{ marginTop: 16 }}>Save Entry</Button>
        </View>
    );
}

const styles = StyleSheet.create({ container: { padding: 16, flex: 1 } });
