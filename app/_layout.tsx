import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function RootLayoutNav() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1 items-center justify-center">
                <Text className="text-white text-xl">Loading...</Text>
            </LinearGradient>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar style="light" />
                <RootLayoutNav />
            </AuthProvider>
        </SafeAreaProvider>
    );
}