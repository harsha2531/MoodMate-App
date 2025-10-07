import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { journalService, JournalEntry } from '../../services/journalService';
import { JournalCard } from '../../components/JournalCard';

export default function AdminScreen() {
    const { userRole } = useAuth();
    const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userRole === 'admin') {
            loadAllEntries();
        }
    }, [userRole]);

    const loadAllEntries = async () => {
        try {
            const entries = await journalService.getAllEntries();
            setAllEntries(entries);
        } catch (error) {
            Alert.alert('Error', 'Failed to load entries');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (entryId: string) => {
        try {
            await journalService.deleteEntry(entryId);
            await loadAllEntries();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete entry');
        }
    };

    if (userRole !== 'admin') {
        return (
            <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1 items-center justify-center">
                <Ionicons name="shield" size={60} color="#FF6C6C" />
                <Text className="text-white text-xl font-semibold mt-4">Access Denied</Text>
                <Text className="text-gray-400 text-center mt-2 px-6">
                    You need admin privileges to access this page.
                </Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1">
            <ScrollView className="flex-1 px-6 pt-12">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-white text-2xl font-bold">Admin Dashboard</Text>
                        <Text className="text-gray-400">Manage all journal entries</Text>
                    </View>
                    <TouchableOpacity onPress={loadAllEntries}>
                        <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="w-10 h-10 rounded-xl items-center justify-center">
                            <Ionicons name="refresh" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View className="bg-gray-800 rounded-xl p-4 mb-6">
                    <Text className="text-white text-lg font-semibold">Statistics</Text>
                    <View className="flex-row justify-between mt-3">
                        <View className="items-center">
                            <Text className="text-white text-2xl font-bold">{allEntries.length}</Text>
                            <Text className="text-gray-400 text-sm">Total Entries</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white text-2xl font-bold">
                                {new Set(allEntries.map(entry => entry.userId)).size}
                            </Text>
                            <Text className="text-gray-400 text-sm">Unique Users</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-white text-xl font-semibold mb-4">All Journal Entries</Text>

                {loading ? (
                    <View className="items-center py-10">
                        <Text className="text-gray-400">Loading entries...</Text>
                    </View>
                ) : allEntries.length === 0 ? (
                    <View className="items-center py-10">
                        <Ionicons name="journal-outline" size={60} color="#666" />
                        <Text className="text-gray-400 text-lg mt-4">No entries found</Text>
                    </View>
                ) : (
                    allEntries.map(entry => (
                        <JournalCard
                            key={entry.id}
                            entry={entry}
                            onEdit={() => {}} // Admin can't edit user entries
                            onDelete={handleDelete}
                            showActions={true} // Admin can only delete
                        />
                    ))
                )}
            </ScrollView>
        </LinearGradient>
    );
}