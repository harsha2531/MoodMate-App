import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const { user, userRole } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await authService.logout();
                        router.replace('/login');
                    }
                },
            ]
        );
    };

    if (!user) {
        return null;
    }

    return (
        <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1">
            <ScrollView className="flex-1 px-6 pt-12">
                <View className="items-center mb-8">
                    <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="w-24 h-24 rounded-2xl items-center justify-center">
                        <Ionicons name="person" size={40} color="white" />
                    </LinearGradient>
                    <Text className="text-white text-2xl font-bold mt-4">{user.displayName}</Text>
                    <View className="flex-row items-center mt-2">
                        <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="px-3 py-1 rounded-full">
                            <Text className="text-white text-sm font-semibold capitalize">
                                {userRole}
                            </Text>
                        </LinearGradient>
                    </View>
                    <Text className="text-gray-400 mt-2">{user.email}</Text>
                </View>

                <View className="space-y-4">
                    <TouchableOpacity className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                        <Ionicons name="notifications-outline" size={24} color="#6C8CFF" />
                        <Text className="text-white text-lg ml-4 flex-1">Notifications</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                        <Ionicons name="lock-closed-outline" size={24} color="#6C8CFF" />
                        <Text className="text-white text-lg ml-4 flex-1">Privacy & Security</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                        <Ionicons name="help-circle-outline" size={24} color="#6C8CFF" />
                        <Text className="text-white text-lg ml-4 flex-1">Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-gray-800 rounded-xl p-4 flex-row items-center">
                        <Ionicons name="information-circle-outline" size={24} color="#6C8CFF" />
                        <Text className="text-white text-lg ml-4 flex-1">About MoodMate</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="mt-8 mb-6 bg-red-500 rounded-xl p-4 items-center"
                >
                    <Text className="text-white text-lg font-semibold">Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}