import React from "react";
import { Stack } from "expo-router";

export default function DashboardLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Dashboard" }} />
            <Stack.Screen name="new-entry" options={{ title: "New Entry" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
            <Stack.Screen name="stats" options={{ title: "Statistics" }} />
            <Stack.Screen name="timeline" options={{ title: "Timeline" }} />
        </Stack>
    );
}
