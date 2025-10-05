import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const Loading = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
});

export default Loading;
