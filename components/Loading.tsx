import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Loading() {
    return (
        <View style={styles.center}>
            <ActivityIndicator animating size={48} />
        </View>
    );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: "center", justifyContent: "center" } });
