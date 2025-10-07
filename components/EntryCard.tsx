import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

export default function EntryCard({ entry }: any) {
    return (
        <Card style={{ marginBottom: 8 }}>
            <Card.Content>
                <Title>{entry.mood}</Title>
                <Paragraph>{entry.text}</Paragraph>
                {entry.imageUrl ? <Image source={{ uri: entry.imageUrl }} style={{ width: "100%", height: 180 }} /> : null}
            </Card.Content>
        </Card>
    );
}
