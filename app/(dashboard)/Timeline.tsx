import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { getEntriesListener, getEntriesPage } from '../../services/entries';
import EntryCard from '../../components/EntryCard';
import Loading from '../../components/Loading';
import { Button, Text } from 'react-native-paper';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

export default function Timeline() {
    const { user } = useContext(AuthContext);
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        // Real-time listener (gives all recent docs); if data becomes large, you can switch to a limited snapshot
        const unsub = getEntriesListener(user.uid, (rows) => {
            setEntries(rows);
            setLoading(false);
            // store last doc for pagination (if any)
            // NOTE: We can't easily obtain QueryDocumentSnapshot objects from onSnapshot-mapped rows,
            // so for pagination we will use getEntriesPage separately (see loadMore).
        });
        return () => unsub();
    }, [user]);

    const loadMore = async () => {
        if (!user || loadingMore) return;
        setLoadingMore(true);
        try {
            const pageSize = 8;
            // If we haven't initialized lastDocRef, get the first page to find lastDoc
            const res = await getEntriesPage(user.uid, pageSize, lastDocRef.current || undefined);
            if (res.docs.length > 0) {
                // append fetched docs that aren't already in entries
                // simple duplicate avoidance (by id)
                const existingIds = new Set(entries.map((e) => e.id));
                const toAdd = res.docs.filter((d) => !existingIds.has(d.id));
                setEntries((prev) => [...prev, ...toAdd]);
            }
            if (res.last) {
                lastDocRef.current = res.last as QueryDocumentSnapshot;
            } else {
                // no more
                lastDocRef.current = null;
            }
        } catch (err) {
            console.error('loadMore error', err);
        } finally {
            setLoadingMore(false);
        }
    };

    const onRefresh = async () => {
        if (!user) return;
        setRefreshing(true);
        // real-time listener will refresh; but we also clear pagination markers
        lastDocRef.current = null;
        // ensure base load via getEntriesPage to set lastDoc
        try {
            const res = await getEntriesPage(user.uid, 8, undefined);
            setEntries(res.docs);
            lastDocRef.current = res.last || null;
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <View style={styles.container}>
            {entries.length === 0 ? (
                <View style={{ padding: 16 }}>
                    <Text>No entries yet — create your first one!</Text>
                </View>
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => <EntryCard entry={item} />}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? <Loading size="small" /> : lastDocRef.current ? <Button onPress={loadMore}>Load more</Button> : null
                    }
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 8 } });
