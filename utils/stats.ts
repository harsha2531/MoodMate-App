type Entry = any;
export function computeWeeklyMoodCounts(entries: Entry[]) {
    // returns counts for [😊, 😢, 😡, 😌]
    const map = { '😊': 0, '😢': 0, '😡': 0, '😌': 0 };
    for (const e of entries) {
        const mood = e.mood || '😊';
        map[mood] = (map[mood] || 0) + 1;
    }
    return [map['😊'], map['😢'], map['😡'], map['😌']];
}
