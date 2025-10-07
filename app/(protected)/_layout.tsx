import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedLayout() {
    const { user } = useAuth();
    if (!user) return <Redirect href="/login" />;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" />
            <Stack.Screen name="stats" />
        </Stack>
    );
}
