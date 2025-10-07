import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getEntriesForUser } from "../../services/entries";
import { BarChart } from "react-native-chart-kit";

export default function Stats() {
    const { user } = useContext(AuthContext);
    const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const raw = await getEntriesForUser(user.uid);
            const map = { "😊": 0, "😢": 0, "😡": 0, "😌": 0 };
            raw.forEach((r: any) => { map[r.mood] = (map[r.mood] || 0) + 1; });
            setCounts([map["😊"], map["😢"], map["😡"], map["😌"]]);
        })();
    }, [user]);

    const screenWidth = Dimensions.get("window").width;

    return (
        <View style={styles.container}>
            <BarChart
                data={{ labels: ["😊", "😢", "😡", "😌"], datasets: [{ data: counts }] }}
                width={screenWidth - 32}
                height={220}
                fromZero
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
