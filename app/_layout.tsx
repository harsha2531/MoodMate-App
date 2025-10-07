import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
    return (
        <PaperProvider>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(dashboard)" />
                    <Stack.Screen name="(admin)" />
                </Stack>
            </AuthProvider>
        </PaperProvider>
    );
}
