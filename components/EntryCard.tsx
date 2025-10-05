import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { format } from 'date-fns';

export default function EntryCard({ entry }: any) {
    const created = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date();
    return (
        <Card style={{ marginBottom: 8 }}>
            <Card.Content>
                <View style={styles.header}>
                    <Title>{entry.mood} {format(created, 'PPpp')}</Title>
                </View>
                <Paragraph>{entry.text}</Paragraph>
                {entry.imageUrl ? <Image source={{ uri: entry.imageUrl }} style={{ width: '100%', height: 200, marginTop: 8 }} /> : null}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } });
