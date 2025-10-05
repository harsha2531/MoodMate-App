import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';

export default function Register({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const { signUp } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const onRegister = async () => {
        try {
            setLoading(true);
            await signUp({ email, password, firstName, lastName, adminCode });
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={{ marginBottom: 16 }}>Create MoodMate account</Title>
            <TextInput label="First name" value={firstName} onChangeText={setFirst} />
            <TextInput label="Last name" value={lastName} onChangeText={setLast} />
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput label="Admin code (optional)" value={adminCode} onChangeText={setAdminCode} />
            <Button mode="contained" onPress={onRegister} loading={loading} style={{ marginTop: 16 }}>
                Register
            </Button>
            <Button onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
                Back to Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center' },
});
