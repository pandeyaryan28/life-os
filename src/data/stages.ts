import type { PlayerStage } from '../types';

export const STAGES: PlayerStage[] = [
    {
        id: 'awakened',
        name: 'Awakened',
        description: 'Player has activated LIFE OS and begun conscious self-tracking.',
        entryConditions: {}, // Default stage
        unlocks: ['Quest creation', 'Basic stats', 'Daily quests'],
        restrictions: ['Limited automation', 'No passive bonuses'],
    },
    {
        id: 'disciplined',
        name: 'Disciplined',
        description: 'Consistent adherence to daily objectives and system rules.',
        entryConditions: {
            minLevel: 5,
            minStats: { discipline: 15 },
        },
        unlocks: ['Auto-renew daily quests', 'Weekly planning view'],
        restrictions: ['No complex automation'],
    },
    {
        id: 'focused',
        name: 'Focused',
        description: 'Mastery of attention and execution efficiency.',
        entryConditions: {
            minLevel: 10,
            minStats: { focus: 20, mental: 20 },
        },
        unlocks: ['Performance multipliers (Configurable)'],
        restrictions: [],
    },
    {
        id: 'optimized',
        name: 'Optimized',
        description: 'Data-driven refinement of all life systems.',
        entryConditions: {
            minLevel: 20,
            minStats: { mental: 30, discipline: 30 },
        },
        unlocks: ['Auto-failure detection', 'Stat recovery multipliers'],
        restrictions: [],
    },
    {
        id: 'ascendant',
        name: 'Ascendant',
        description: 'Transcending standard human performance limits.',
        entryConditions: {
            minLevel: 40,
            minStats: { physical: 40, mental: 40 },
        },
        unlocks: ['Trait discovery mode', 'Deep retrospective analysis'],
        restrictions: [],
    },
    {
        id: 'architect',
        name: 'Architect',
        description: 'Total structural control over the life operating system.',
        entryConditions: {
            minLevel: 60,
            minStats: { discipline: 50, focus: 50, knowledge: 50 },
        },
        unlocks: ['System override privileges', 'Custom trait creation'],
        restrictions: [],
    }
];
