import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {Href, router} from 'expo-router';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    // const router = useRouter();


    React.useEffect(() => {
        if (user) {
            router.replace('/(tabs)' as Href);
        }
    }, [user]);

    const handleRegister = async () => {
        if (!form.fullName || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.register(form.email, form.password, form.fullName);
            // Navigation will be handled by the auth state change in useEffect
        } catch (error: any) {
            Alert.alert('Error :','Registration Failed..! Please try again later');
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
                    <Text className="text-gray-400 text-lg mt-2">Create your account</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-white text-sm font-semibold mb-2">Full Name</Text>
                        <TextInput
                            value={form.fullName}
                            onChangeText={(text) => setForm({ ...form, fullName: text })}
                            placeholder="Enter your full name"
                            placeholderTextColor="#666"
                            className="bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700"
                        />
                    </View>

                    <View>
                        <Text className="text-white text-sm font-semibold mb-2">Email</Text>
                        <TextInput
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
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
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                            placeholder="Create a password"
                            placeholderTextColor="#666"
                            className="bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700"
                            secureTextEntry
                        />
                    </View>

                    <View>
                        <Text className="text-white text-sm font-semibold mb-2">Confirm Password</Text>
                        <TextInput
                            value={form.confirmPassword}
                            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                            placeholder="Confirm your password"
                            placeholderTextColor="#666"
                            className="bg-gray-800 text-white rounded-xl px-4 py-4 border border-gray-700"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className="mt-6"
                    >
                        <LinearGradient
                            colors={['#6C8CFF', '#6CFFD2']}
                            className="rounded-xl py-4 items-center"
                        >
                            <Text className="text-white text-lg font-semibold">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="py-4 items-center"
                    >
                        <Text className="text-gray-400">
                            Already have an account? <Text className="text-[#6C8CFF] font-semibold">Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}