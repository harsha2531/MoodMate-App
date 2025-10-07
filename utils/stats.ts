import { Entry } from "../services/entries";

/**
 * Computes counts for each mood over the last 7 days.
 * Returns an array [😊, 😢, 😡, 😌] counts.
 */
export function computeWeeklyMoodCounts(entries: Entry[]): number[] {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const filtered = entries.filter(
        (e) => new Date(e.date) >= weekAgo && new Date(e.date) <= now
    );

    const moods = ["😊", "😢", "😡", "😌"];
    return moods.map((m) => filtered.filter((e) => e.mood === m).length);
}
