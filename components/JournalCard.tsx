import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { JournalEntry } from '../services/journalService';

interface JournalCardProps {
    entry: JournalEntry;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (entryId: string) => void;
    showActions?: boolean;
}

export const JournalCard: React.FC<JournalCardProps> = ({
                                                            entry,
                                                            onEdit,
                                                            onDelete,
                                                            showActions = true
                                                        }) => {
    const handleDelete = () => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(entry.id!) },
            ]
        );
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case '😊': return ['#FF9D6C', '#FF6B9D'];
            case '😢': return ['#6C8CFF', '#6CFFD2'];
            case '😡': return ['#FF6C6C', '#FF9D6C'];
            case '😌': return ['#6CFF8C', '#6CFFD2'];
            default: return ['#6C8CFF', '#6CFFD2'];
        }
    };

    return (
        <LinearGradient
            colors={['#2A2A2A', '#1A1A1A']}
            className="rounded-2xl p-4 mb-4 border border-gray-700"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                    <LinearGradient
                        colors={getMoodColor(entry.mood)}
                        className="w-10 h-10 rounded-xl items-center justify-center"
                    >
                        <Text className="text-xl">{entry.mood}</Text>
                    </LinearGradient>
                    <View className="ml-3">
                        <Text className="text-white font-semibold text-lg">
                            {entry.mood === '😊' ? 'Happy' :
                                entry.mood === '😢' ? 'Sad' :
                                    entry.mood === '😡' ? 'Angry' : 'Calm'}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                            {entry.createdAt.toLocaleDateString()} • {entry.createdAt.toLocaleTimeString()}
                        </Text>
                    </View>
                </View>

                {showActions && (
                    <View className="flex-row">
                        <TouchableOpacity onPress={() => onEdit(entry)} className="mr-3">
                            <Ionicons name="create-outline" size={20} color="#6C8CFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color="#FF6C6C" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Text className="text-white text-base leading-6">{entry.content}</Text>

            {entry.imageUrl && (
                <View className="mt-3 bg-gray-800 rounded-xl h-32">
                    {/* Image would be displayed here */}
                    <View className="flex-1 items-center justify-center">
                        <Ionicons name="image-outline" size={40} color="#6C8CFF" />
                        <Text className="text-gray-400 mt-2">Image Attached</Text>
                    </View>
                </View>
            )}
        </LinearGradient>
    );
};