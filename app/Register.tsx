import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { router } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";

export default function Register() {
    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);

    const onRegister = async () => {
        try {
            setLoading(true);
            await signUp(email, password, displayName);
            router.replace("/(dashboard)");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={{ marginBottom: 20 }}>Create Account</Title>
            <TextInput label="Full Name" value={displayName} onChangeText={setDisplayName} />
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button mode="contained" onPress={onRegister} loading={loading} style={{ marginTop: 16 }}>
                Register
            </Button>
            <Button onPress={() => router.push("/(auth)/login")} style={{ marginTop: 8 }}>
                Back to Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: "center" },
});
