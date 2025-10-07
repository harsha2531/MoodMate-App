import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
    const { logout } = useAuth();
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Welcome Home 🎉</Text>
            <Button title="View Stats" onPress={() => router.push("/(protected)/stats")} />
            <Button title="Logout" onPress={logout} />
        </View>
    );
}
