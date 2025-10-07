import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getEntriesForUser } from "../../services/entries";
import Loading from "../../components/Loading";
import EntryCard from "../../components/EntryCard";

export default function Timeline() {
    const { user } = useContext(AuthContext);
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const data = await getEntriesForUser(user.uid);
            setEntries(data);
            setLoading(false);
        })();
    }, [user]);

    if (loading) return <Loading />;

    return (
        <View style={styles.container}>
            <FlatList data={entries} keyExtractor={(i) => i.id} renderItem={({ item }) => <EntryCard entry={item} />} />
        </View>
    );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 8 } });
