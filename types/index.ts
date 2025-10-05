export interface MoodEntry {
    id: string;
    mood: string;
    note: string;
    imageUrl?: string;
    createdAt: any;
    userId: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
}

export type MoodType = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited';
