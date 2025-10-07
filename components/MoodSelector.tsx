import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Mood {
    emoji: string;
    label: string;
    color: [string, string]; // Explicitly define as tuple
}

const moods: Mood[] = [
    { emoji: '😊', label: 'Happy', color: ['#FF9D6C', '#FF6B9D'] },
    { emoji: '😢', label: 'Sad', color: ['#6C8CFF', '#6CFFD2'] },
    { emoji: '😡', label: 'Angry', color: ['#FF6C6C', '#FF9D6C'] },
    { emoji: '😌', label: 'Calm', color: ['#6CFF8C', '#6CFFD2'] },
];

interface MoodSelectorProps {
    selectedMood: string;
    onMoodSelect: (mood: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
    return (
        <View className="flex-row justify-between mb-6">
            {moods.map((mood) => (
                <TouchableOpacity
                    key={mood.emoji}
                    onPress={() => onMoodSelect(mood.emoji)}
                    className="items-center"
                >
                    <LinearGradient
                        colors={mood.color}
                        className={`w-16 h-16 rounded-2xl items-center justify-center ${
                            selectedMood === mood.emoji ? 'border-4 border-white' : ''
                        }`}
                    >
                        <Text className="text-2xl">{mood.emoji}</Text>
                    </LinearGradient>
                    <Text className="text-white mt-2 text-sm font-semibold">{mood.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};