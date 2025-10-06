import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { getEntriesForUser } from '../../services/entries';
import { BarChart } from 'react-native-chart-kit';
import { computeWeeklyMoodCounts } from '../../utils/stats';

export default function Stats() {
    const { user } = useContext(AuthContext);
    const [counts, setCounts] = useState<number[]>([]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const raw = await getEntriesForUser(user.uid);
            const c = computeWeeklyMoodCounts(raw);
            setCounts(c);
        })();
    }, [user]);

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            {counts.length > 0 ? (
                <BarChart
                    data={{ labels: ['😊', '😢', '😡', '😌'], datasets: [{ data: counts }] }}
                    width={screenWidth - 32}
                    height={220}
                    fromZero
                    chartConfig={{
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                    }}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });

// import React, { useContext, useEffect, useState } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import { AuthContext } from '../../contexts/AuthContext';
// import { getEntriesListener, Entry } from '../../services/entries';
// // @ts-ignore - ignore missing type declarations
// import { BarChart } from 'react-native-chart-kit';
// import { computeWeeklyMoodCounts } from '../../utils/stats';
//
// export default function Stats() {
//     const { user } = useContext(AuthContext);
//     const [counts, setCounts] = useState<number[]>([]);
//
//     useEffect(() => {
//         if (!user) return;
//
//         const unsubscribe = getEntriesListener(user.uid, (entries: Entry[]) => {
//             const c = computeWeeklyMoodCounts(entries);
//             setCounts(c);
//         });
//
//         return () => unsubscribe();
//     }, [user]);
//
//     const screenWidth = Dimensions.get('window').width;
//
//     return (
//         <View style={styles.container}>
//             {counts.length > 0 && (
//                 <BarChart
//                     data={{
//                         labels: ['😊', '😢', '😡', '😌'],
//                         datasets: [{ data: counts }],
//                     }}
//                     width={screenWidth - 32}
//                     height={220}
//                     fromZero
//                     chartConfig={{
//                         backgroundGradientFrom: '#fff',
//                         backgroundGradientTo: '#fff',
//                         decimalPlaces: 0,
//                         color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
//                     }}
//                 />
//             )}
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16 },
// });
