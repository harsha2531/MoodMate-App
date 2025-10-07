import React, { useState, useContext } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";

export default function Register() {
    const [firstName, setFirst] = useState("");
    const [lastName, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signUp } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const onRegister = async () => {
        if (!email.trim() || !password.trim()) {
            alert("Please fill email and password.");
            return;
        }
        try {
            setLoading(true);
            await signUp({ email: email.trim(), password: password.trim(), firstName, lastName });
            // After sign up the user will be signed in automatically (AuthContext's onAuthStateChanged will react)
        } catch (err: any) {
            alert(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.container}>
                <Title style={styles.title}>Create MoodMate account</Title>
                <TextInput label="First name" value={firstName} onChangeText={setFirst} style={styles.input} />
                <TextInput label="Last name" value={lastName} onChangeText={setLast} style={styles.input} />
                <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
                <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

                <Button mode="contained" onPress={onRegister} loading={loading} style={styles.button}>
                    Create Account
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: "center" },
    title: { marginBottom: 12, textAlign: "center", fontSize: 20 },
    input: { marginBottom: 10, backgroundColor: "#fff" },
    button: { marginTop: 10 },
});
