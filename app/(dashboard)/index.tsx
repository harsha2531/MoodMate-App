import React from "react";
import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function DashboardHome() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Welcome to MoodMate 🌿</Text>
            <Button title="New Entry" onPress={() => router.push("/(dashboard)/NewEntry")} />
            <Button title="Profile" onPress={() => router.push("/(dashboard)/Profile")} />
            <Button title="Stats" onPress={() => router.push("/(dashboard)/Stats")} />
            <Button title="Timeline" onPress={() => router.push("/(dashboard)/Timeline")} />
        </View>
    );
}
