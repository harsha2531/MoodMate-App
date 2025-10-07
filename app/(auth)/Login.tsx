import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const onLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            setLoading(true);
            await signIn(email.trim(), password.trim());
            // Navigation after login happens inside AuthContext automatically (if you handle it there)
        } catch (err: any) {
            alert(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Title style={styles.title}>MoodMate — Login</Title>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={onLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    Sign In
                </Button>

                <Button
                    onPress={() => navigation.navigate('Register')}
                    disabled={loading}
                    style={styles.linkButton}
                >
                    Create Account
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 10,
    },
    linkButton: {
        marginTop: 8,
    },
});
