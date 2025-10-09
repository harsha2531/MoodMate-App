import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { journalService, JournalEntry } from '../../services/journalService';
import { MoodSelector } from '../../components/MoodSelector';
import { JournalCard } from '../../components/JournalCard';
import { router } from 'expo-router';

export default function HomeScreen() {
    const { user, userRole, loading: authLoading } = useAuth();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [form, setForm] = useState({
        mood: '',
        content: '',
    });
    const [loading, setLoading] = useState(false);
    const [loadingEntries, setLoadingEntries] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user && !authLoading) {
            loadEntries();
        }
    }, [user, authLoading]);

    const loadEntries = async () => {
        if (!user) return;

        setLoadingEntries(true);
        try {
            const userEntries = await journalService.getUserEntries(user.uid);
            setEntries(userEntries);
        } catch (error: any) {
            console.error('Load entries error:', error);
            if (error.message.includes('index required')) {
                Alert.alert(
                    'Index Required',
                    'Firestore needs to create an index. This should happen automatically. Please wait a few minutes and try again.'
                );
            } else if (error.message.includes('Permission denied')) {
                Alert.alert(
                    'Permission Error',
                    'Please check your Firestore security rules.'
                );
            } else {
                Alert.alert('Error', error.message || 'Failed to load entries');
            }
        } finally {
            setLoadingEntries(false);
        }
    };

    const handleSaveEntry = async () => {
        if (!form.mood || !form.content.trim()) {
            Alert.alert('Error', 'Please select a mood and write your thoughts');
            return;
        }

        if (!user) return;

        setLoading(true);
        try {
            if (editingEntry) {
                await journalService.updateEntry(editingEntry.id!, {
                    mood: form.mood,
                    content: form.content.trim(),
                });
                Alert.alert('Success', 'Entry updated successfully!');
            } else {
                await journalService.createEntry({
                    userId: user.uid,
                    mood: form.mood,
                    content: form.content.trim(),
                });
                Alert.alert('Success', 'Entry saved successfully!');
            }

            setShowModal(false);
            setForm({ mood: '', content: '' });
            setEditingEntry(null);

            // Add a small delay before reloading to ensure data is indexed
            setTimeout(() => {
                loadEntries();
            }, 1000);

        } catch (error: any) {
            console.error('Save entry error:', error);
            Alert.alert('Error', error.message || 'Failed to save entry');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry: JournalEntry) => {
        setEditingEntry(entry);
        setForm({
            mood: entry.mood,
            content: entry.content,
        });
        setShowModal(true);
    };

    const handleDelete = async (entryId: string) => {
        try {
            await journalService.deleteEntry(entryId);
            Alert.alert('Success', 'Entry deleted successfully!');
            await loadEntries();
        } catch (error: any) {
            console.error('Delete entry error:', error);
            Alert.alert('Error', error.message || 'Failed to delete entry');
        }
    };

    const resetForm = () => {
        setForm({ mood: '', content: '' });
        setEditingEntry(null);
        setShowModal(false);
    };

    const getMoodStats = () => {
        const stats = { '😊': 0, '😢': 0, '😡': 0, '😌': 0 };
        entries.forEach(entry => {
            stats[entry.mood as keyof typeof stats]++;
        });
        return stats;
    };

    const moodStats = getMoodStats();

    if (authLoading) {
        return (
            <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1 items-center justify-center">
                <Text className="text-white text-xl">Loading...</Text>
            </LinearGradient>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1">
            <ScrollView className="flex-1 px-6 pt-12">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-white text-2xl font-bold">Hello, {user?.displayName}!</Text>
                        <Text className="text-gray-400">How are you feeling today?</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="w-10 h-10 rounded-xl items-center justify-center">
                            <Ionicons name="person" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Weekly Stats */}
                <LinearGradient colors={['#2A2A2A', '#1A1A1A']} className="rounded-2xl p-4 mb-6 border border-gray-700">
                    <Text className="text-white text-lg font-semibold mb-3">This Week's Mood</Text>
                    <View className="flex-row justify-between">
                        {Object.entries(moodStats).map(([mood, count]) => (
                            <View key={mood} className="items-center">
                                <Text className="text-2xl">{mood}</Text>
                                <Text className="text-white font-semibold mt-1">{count}</Text>
                            </View>
                        ))}
                    </View>
                </LinearGradient>

                {/* Add New Entry Button */}
                <TouchableOpacity
                    onPress={() => setShowModal(true)}
                    className="mb-6"
                    disabled={loadingEntries}
                >
                    <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="rounded-xl py-4 items-center">
                        <Text className="text-white text-lg font-semibold">+ New Journal Entry</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Journal Entries */}
                <Text className="text-white text-xl font-semibold mb-4">Recent Entries</Text>

                {loadingEntries ? (
                    <View className="items-center py-10">
                        <Text className="text-gray-400">Loading entries...</Text>
                    </View>
                ) : entries.length === 0 ? (
                    <View className="items-center py-10">
                        <Ionicons name="journal-outline" size={60} color="#666" />
                        <Text className="text-gray-400 text-lg mt-4">No entries yet</Text>
                        <Text className="text-gray-500 text-center mt-2">
                            Start by adding your first journal entry to track your mood!
                        </Text>
                    </View>
                ) : (
                    entries.map(entry => (
                        <JournalCard
                            key={entry.id}
                            entry={entry}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </ScrollView>

            {/* Add/Edit Entry Modal */}
            <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
                <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1 pt-12">
                    <View className="px-6 flex-1">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-2xl font-bold">
                                {editingEntry ? 'Edit Entry' : 'New Entry'}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-white text-lg font-semibold mb-4">How are you feeling?</Text>
                        <MoodSelector
                            selectedMood={form.mood}
                            onMoodSelect={(mood) => setForm({ ...form, mood })}
                        />

                        <Text className="text-white text-lg font-semibold mb-4">What's on your mind?</Text>
                        <TextInput
                            value={form.content}
                            onChangeText={(text) => setForm({ ...form, content: text })}
                            placeholder="Write your thoughts here..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={6}
                            className="bg-gray-800 text-white rounded-xl p-4 border border-gray-700 text-base leading-6"
                            textAlignVertical="top"
                        />

                        <View className="flex-1" />

                        <TouchableOpacity
                            onPress={handleSaveEntry}
                            disabled={loading}
                            className="mb-6"
                        >
                            <LinearGradient
                                colors={['#6C8CFF', '#6CFFD2']}
                                className="rounded-xl py-4 items-center"
                            >
                                <Text className="text-white text-lg font-semibold">
                                    {loading ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save Entry'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Modal>
        </LinearGradient>
    );
}



// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../context/AuthContext';
// import { journalService, JournalEntry } from '../../services/journalService';
// import { MoodSelector } from '../../components/MoodSelector';
// import { JournalCard } from '../../components/JournalCard';
// import { router } from 'expo-router';
//
// export default function HomeScreen() {
//     const { user, userRole, loading: authLoading } = useAuth();
//     const [entries, setEntries] = useState<JournalEntry[]>([]);
//     const [showModal, setShowModal] = useState(false);
//     const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
//     const [form, setForm] = useState({
//         mood: '',
//         content: '',
//     });
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (!authLoading && !user) {
//             router.replace('/login');
//         }
//     }, [user, authLoading]);
//
//     useEffect(() => {
//         if (user && !authLoading) {
//             loadEntries();
//         }
//     }, [user, authLoading]);
//
//     const loadEntries = async () => {
//         if (!user) return;
//
//         try {
//             const userEntries = await journalService.getUserEntries(user.uid);
//             setEntries(userEntries);
//         } catch (error) {
//             Alert.alert('Error', 'Failed to load entries');
//         }
//     };
//
//     const handleSaveEntry = async () => {
//         if (!form.mood || !form.content.trim()) {
//             Alert.alert('Error', 'Please select a mood and write your thoughts');
//             return;
//         }
//
//         if (!user) return;
//
//         setLoading(true);
//         try {
//             if (editingEntry) {
//                 await journalService.updateEntry(editingEntry.id!, {
//                     mood: form.mood,
//                     content: form.content.trim(),
//                 });
//             } else {
//                 await journalService.createEntry({
//                     userId: user.uid,
//                     mood: form.mood,
//                     content: form.content.trim(),
//                 });
//             }
//
//             setShowModal(false);
//             setForm({ mood: '', content: '' });
//             setEditingEntry(null);
//             await loadEntries();
//         } catch (error) {
//             Alert.alert('Error', 'Failed to save entry');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleEdit = (entry: JournalEntry) => {
//         setEditingEntry(entry);
//         setForm({
//             mood: entry.mood,
//             content: entry.content,
//         });
//         setShowModal(true);
//     };
//
//     const handleDelete = async (entryId: string) => {
//         try {
//             await journalService.deleteEntry(entryId);
//             await loadEntries();
//         } catch (error) {
//             Alert.alert('Error', 'Failed to delete entry');
//         }
//     };
//
//     const resetForm = () => {
//         setForm({ mood: '', content: '' });
//         setEditingEntry(null);
//         setShowModal(false);
//     };
//
//     const getMoodStats = () => {
//         const stats = { '😊': 0, '😢': 0, '😡': 0, '😌': 0 };
//         entries.forEach(entry => {
//             stats[entry.mood as keyof typeof stats]++;
//         });
//         return stats;
//     };
//
//     const moodStats = getMoodStats();
//
//     if (authLoading) {
//         return (
//             <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1 items-center justify-center">
//                 <Text className="text-white text-xl">Loading...</Text>
//             </LinearGradient>
//         );
//     }
//
//     if (!user) {
//         return null; // Will redirect from useEffect
//     }
//
//     return (
//         <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1">
//             <ScrollView className="flex-1 px-6 pt-12">
//                 {/* ... rest of your existing JSX ... */}
//                 <View className="flex-row justify-between items-center mb-6">
//                     <View>
//                         <Text className="text-white text-2xl font-bold">Hello, {user?.displayName}!</Text>
//                         <Text className="text-gray-400">How are you feeling today?</Text>
//                     </View>
//                     <TouchableOpacity onPress={() => router.push('/profile')}>
//                         <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="w-10 h-10 rounded-xl items-center justify-center">
//                             <Ionicons name="person" size={20} color="white" />
//                         </LinearGradient>
//                     </TouchableOpacity>
//                 </View>
//
//                 {/* Weekly Stats */}
//                 <LinearGradient colors={['#2A2A2A', '#1A1A1A']} className="rounded-2xl p-4 mb-6 border border-gray-700">
//                     <Text className="text-white text-lg font-semibold mb-3">This Week's Mood</Text>
//                     <View className="flex-row justify-between">
//                         {Object.entries(moodStats).map(([mood, count]) => (
//                             <View key={mood} className="items-center">
//                                 <Text className="text-2xl">{mood}</Text>
//                                 <Text className="text-white font-semibold mt-1">{count}</Text>
//                             </View>
//                         ))}
//                     </View>
//                 </LinearGradient>
//
//                 {/* Add New Entry Button */}
//                 <TouchableOpacity
//                     onPress={() => setShowModal(true)}
//                     className="mb-6"
//                 >
//                     <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="rounded-xl py-4 items-center">
//                         <Text className="text-white text-lg font-semibold">+ New Journal Entry</Text>
//                     </LinearGradient>
//                 </TouchableOpacity>
//
//                 {/* Journal Entries */}
//                 <Text className="text-white text-xl font-semibold mb-4">Recent Entries</Text>
//                 {entries.length === 0 ? (
//                     <View className="items-center py-10">
//                         <Ionicons name="journal-outline" size={60} color="#666" />
//                         <Text className="text-gray-400 text-lg mt-4">No entries yet</Text>
//                         <Text className="text-gray-500 text-center mt-2">
//                             Start by adding your first journal entry to track your mood!
//                         </Text>
//                     </View>
//                 ) : (
//                     entries.map(entry => (
//                         <JournalCard
//                             key={entry.id}
//                             entry={entry}
//                             onEdit={handleEdit}
//                             onDelete={handleDelete}
//                         />
//                     ))
//                 )}
//             </ScrollView>
//
//             {/* Add/Edit Entry Modal */}
//             <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
//                 <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1 pt-12">
//                     <View className="px-6 flex-1">
//                         <View className="flex-row justify-between items-center mb-6">
//                             <Text className="text-white text-2xl font-bold">
//                                 {editingEntry ? 'Edit Entry' : 'New Entry'}
//                             </Text>
//                             <TouchableOpacity onPress={resetForm}>
//                                 <Ionicons name="close" size={24} color="white" />
//                             </TouchableOpacity>
//                         </View>
//
//                         <Text className="text-white text-lg font-semibold mb-4">How are you feeling?</Text>
//                         <MoodSelector
//                             selectedMood={form.mood}
//                             onMoodSelect={(mood) => setForm({ ...form, mood })}
//                         />
//
//                         <Text className="text-white text-lg font-semibold mb-4">What's on your mind?</Text>
//                         <TextInput
//                             value={form.content}
//                             onChangeText={(text) => setForm({ ...form, content: text })}
//                             placeholder="Write your thoughts here..."
//                             placeholderTextColor="#666"
//                             multiline
//                             numberOfLines={6}
//                             className="bg-gray-800 text-white rounded-xl p-4 border border-gray-700 text-base leading-6"
//                             textAlignVertical="top"
//                         />
//
//                         <View className="flex-1" />
//
//                         <TouchableOpacity
//                             onPress={handleSaveEntry}
//                             disabled={loading}
//                             className="mb-6"
//                         >
//                             <LinearGradient
//                                 colors={['#6C8CFF', '#6CFFD2']}
//                                 className="rounded-xl py-4 items-center"
//                             >
//                                 <Text className="text-white text-lg font-semibold">
//                                     {loading ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save Entry'}
//                                 </Text>
//                             </LinearGradient>
//                         </TouchableOpacity>
//                     </View>
//                 </LinearGradient>
//             </Modal>
//         </LinearGradient>
//     );
// }