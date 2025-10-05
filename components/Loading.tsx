import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Loading({ size = 'large' as 'small' | 'large' }) {
    return (
        <View style={styles.center}>
            <ActivityIndicator animating={true} size={size === 'small' ? 24 : 48} />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
});
