import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await authService.login(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#1A1A1A', '#2A2A2A']} className="flex-1">
            <ScrollView className="flex-1 px-6">
                <View className="items-center mt-20 mb-10">
                    <LinearGradient colors={['#6C8CFF', '#6CFFD2']} className="w-20 h-20 rounded-2xl items-center justify-center">
                        <Ionicons name="heart" size={40} color="white" />
                    </LinearGradient>
                    <Text className="text-white text-3xl font-bold mt-4">MoodMate</Text>
                    <Text className="text-gray-400 text-lg mt-2">Welcome back!</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-white text-sm font-semibold mb-2">Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#666"
                            className="bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-white text-sm font-semibold mb-2">Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#666"
                            className="bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="mt-6"
                    >
                        <LinearGradient
                            colors={['#6C8CFF', '#6CFFD2']}
                            className="rounded-xl py-4 items-center"
                        >
                            <Text className="text-white text-lg font-semibold">
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/register')}
                        className="py-4 items-center"
                    >
                        <Text className="text-gray-400">
                            Don't have an account? <Text className="text-[#6C8CFF] font-semibold">Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}