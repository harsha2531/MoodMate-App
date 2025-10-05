import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

const MOODS = [
    { key: '😊', label: 'Happy', icon: 'emoticon-happy-outline' },
    { key: '😢', label: 'Sad', icon: 'emoticon-sad-outline' },
    { key: '😡', label: 'Angry', icon: 'emoticon-angry-outline' },
    { key: '😌', label: 'Calm', icon: 'emoticon-neutral-outline' },
];

export default function MoodPicker({ value, onChange }: { value: string; onChange: (m: string) => void }) {
    return (
        <View style={styles.row}>
            {MOODS.map((m) => (
                <MoodButton key={m.key} mood={m} active={value === m.key} onPress={() => onChange(m.key)} />
            ))}
        </View>
    );
}

function MoodButton({ mood, active, onPress }: { mood: any; active: boolean; onPress: () => void }) {
    const scale = React.useRef(new Animated.Value(active ? 1.05 : 1)).current;

    React.useEffect(() => {
        Animated.spring(scale, { toValue: active ? 1.05 : 1, useNativeDriver: true, friction: 6 }).start();
    }, [active]);

    return (
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
            <IconButton
                icon={mood.icon}
                size={36}
                onPress={onPress}
                accessibilityLabel={mood.label}
                style={{ backgroundColor: active ? 'rgba(0,0,0,0.06)' : undefined }}
            />
            <Text style={{ textAlign: 'center', fontSize: 12 }}>{mood.key}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
});
