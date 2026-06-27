// types/meditation.types.ts
export interface CreateMeditationDTO {
  mood: number;      // 1-10 (1 = muito mal, 10 = muito bem)
  duration: number;  // em minutos
  notes?: string;
}

export interface UpdateMeditationDTO {
  mood?: number;
  duration?: number;
  notes?: string;
}

export interface Meditation {
  id: string;
  mood: number;
  duration: number;
  notes: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeditationWithUser extends Meditation {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MeditationStats {
  totalMeditations: number;
  totalDuration: number;
  averageMood: number;
  averageDuration: number;
  bestMood: number;
  worstMood: number;
  bestMoodDay: Date | null;
  worstMoodDay: Date | null;
  moodTrend: 'improving' | 'declining' | 'stable';
  consistencyRate: number; // percentage of days meditated
}

export interface MeditationFilters {
  startDate?: Date;
  endDate?: Date;
  minMood?: number;
  maxMood?: number;
  minDuration?: number;
  maxDuration?: number;
  hasNotes?: boolean;
}

export interface MoodInsight {
  date: string;
  mood: number;
  duration: number;
  notes?: string;
  averageMoodWeek: number;
  moodChangeFromPrevious: number;
}

export interface WeeklyMoodReport {
  week: number;
  year: number;
  averageMood: number;
  totalMeditations: number;
  totalDuration: number;
  bestDay: {
    date: string;
    mood: number;
  };
  worstDay: {
    date: string;
    mood: number;
  };
  commonNotes: string[];
}

export enum MoodLevel {
  VERY_BAD = 1,
  BAD = 2,
  SOMEWHAT_BAD = 3,
  NEUTRAL_BAD = 4,
  NEUTRAL = 5,
  NEUTRAL_GOOD = 6,
  SOMEWHAT_GOOD = 7,
  GOOD = 8,
  VERY_GOOD = 9,
  EXCELLENT = 10
}

export interface MeditationGoal {
  dailyDurationTarget?: number;
  weeklyDurationTarget?: number;
  weeklySessionsTarget?: number;
  moodImprovementTarget?: number;
}