import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const snap = await getDocs(collection(db, 'users'));
            setUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text variant="headlineSmall" style={{ marginBottom: 12 }}>Admin Dashboard</Text>
            <FlatList data={users} keyExtractor={u => u.id} renderItem={({ item }) => <Text>{item.email} — {item.role}</Text>} />
        </View>
    );
}

const styles = StyleSheet.create({ container: { padding: 16, flex: 1 } });
