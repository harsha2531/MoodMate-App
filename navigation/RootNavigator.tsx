import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../app/(auth)/Login';
import Register from '../app/(auth)/Register';
import DashboardTabs from './DashboardTabs';
import AdminDashboard from '../app/(admin)/AdminDashboard';
import { AuthContext } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, role, loading } = useContext(AuthContext);

    if (loading) return <Loading />;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                </>
            ) : role === 'admin' ? (
                <Stack.Screen name="Admin" component={AdminDashboard} />
            ) : (
                <Stack.Screen name="App" component={DashboardTabs} />
            )}
        </Stack.Navigator>
    );
}
