export interface Stats {
    physical: number;
    mental: number;
    discipline: number;
    knowledge: number;
    creativity: number;
    social: number;
    wealth: number;
    focus: number;
    energy: number;
}

export interface PlayerStage {
    id: string;
    name: string;
    description: string;
    entryConditions: {
        minLevel?: number;
        minStats?: Partial<Stats>;
        customRequirement?: string;
    };
    unlocks: string[];
    restrictions: string[];
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    xp: number;
    maxXp: number;
    category: QuestType;
    lastTrained: string; // ISO Date string
}

export interface Trait {
    id: string;
    name: string;
    description: string;
    effect: string;
    type: 'POSITIVE' | 'NEUTRAL' | 'LIMITING';
    isHidden: boolean;
}

export interface PlayerProfile {
    name: string;
    level: number;
    xp: number;
    maxXp: number;
    rank: string;
    stats: Stats;
    credits: number; // Renamed from coins
    streak: number;
    lastLogin: string; // ISO Date string
    stageId: string;
    stageStartedAt: string; // ISO Date string
    consistencyScore: number;
    focusMode: {
        isActive: boolean;
        sessionStartedAt?: string;
        dailyTotalSeconds: number;
    };
    skills: Skill[];
    traits: Trait[];
}

export type QuestType = 'MAIN' | 'SIDE' | 'DAILY';
export type QuestStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'PAUSED';

export interface Reward {
    xp: number;
    credits?: number;
    stats?: Partial<Stats>;
    items?: string[];
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    type: QuestType;
    status: QuestStatus;
    difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
    rewards: Reward;
    penalty?: Reward;
    deadline?: string; // ISO Date string
    subtasks?: { id: string; text: string; completed: boolean }[];
    goalId?: string; // Linked Goal
    streak?: number; // For Dailies
    lastCompletedAt?: string; // ISO Date string
    completedCount?: number;
}

export interface Expense {
    id: string;
    name: string;
    amount: number;
    category: string;
    timestamp: string;
    type: 'ONE_TIME' | 'RECURRING';
    frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    lastProcessed?: string;
    notes?: string;
}

export interface Goal {
    id: string;
    name: string;
    description: string;
    category?: string;
    deadline?: string;
    associatedStats?: (keyof Stats)[];
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    questIds: string[];
}

export interface ManualAdjustment {
    id: string;
    type: 'XP' | 'STATS' | 'CREDITS' | 'DEBUFF';
    value: number | Partial<Stats>;
    reason: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    message: string;
    type: 'SUCCESS' | 'INFO' | 'WARNING' | 'FAILURE';
    duration?: number;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SYSTEM';
}

export interface GameState {
    version: string;
    player: PlayerProfile;
    quests: Quest[];
    goals: Goal[];
    expenses: Expense[];
    expenseHistory: Expense[];
    manualAdjustments: ManualAdjustment[];
    logs: LogEntry[];
    settings: {
        autoRenewDailies: boolean;
        autoFailureDetection: boolean;
        discoveryMode: boolean;
        statDecayEnabled: boolean;
    };
}
