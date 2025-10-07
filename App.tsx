import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./contexts/AuthContext";
import RootNavigator from "./navigation/RootNavigator";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
    return (
        <PaperProvider>
            <AuthProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </AuthProvider>
        </PaperProvider>
    );
}
