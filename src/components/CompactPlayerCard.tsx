import React, { useState } from 'react';
import type { PlayerProfile } from '../types';
import { ChevronDown, ChevronUp, Activity, Brain, Target, BookOpen, DollarSign, Smile } from 'lucide-react';
import { STAGES } from '../data/stages';

interface CompactPlayerCardProps {
    player: PlayerProfile;
    onViewStage: () => void;
}

export const CompactPlayerCard: React.FC<CompactPlayerCardProps> = ({ player, onViewStage }) => {
    const [expanded, setExpanded] = useState(false);
    const currentStage = STAGES.find(s => s.id === player.stageId) || STAGES[0];
    const xpPercent = player.maxXp > 0 ? (player.xp / player.maxXp) * 100 : 0;

    return (
        <div className="bg-system-panel border border-system-border rounded-sm overflow-hidden">
            {/* Compact Summary — Always Visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse player stats" : "Expand player stats"}
                className="player-compact w-full tap-feedback"
            >
                <div className="player-compact-avatar" aria-hidden="true">
                    {player.firstName?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div className="player-compact-info">
                    <div className="flex items-center justify-between">
                        <span className="player-compact-name">{player.firstName}</span>
                        <div className="flex items-center gap-2">
                            <span className="player-compact-level">LVL {player.level}</span>
                            <span className="player-compact-credits">{player.credits.toLocaleString()} C</span>
                            {expanded ? <ChevronUp size={14} className="text-system-text/60" /> : <ChevronDown size={14} className="text-system-text/60" />}
                        </div>
                    </div>
                    <div className="player-compact-xp-bar">
                        <div className="player-compact-xp-fill" style={{ width: `${xpPercent}%` }} />
                    </div>
                </div>
            </button>

            {/* Expanded Stats */}
            {expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-system-border/30">
                    <div className="pt-3 flex items-center justify-between">
                        <button
                            onClick={onViewStage}
                            aria-label={`View ${currentStage.name} details`}
                            className="text-[11px] font-mono text-system-blue uppercase tracking-widest tap-feedback font-bold"
                        >
                            {currentStage.name} →
                        </button>
                        <span className="text-[10px] font-mono text-system-text/50 uppercase font-bold">
                            {player.xp}/{player.maxXp} XP
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: 'Physical', value: player.stats.physical, icon: <Activity size={12} /> },
                            { label: 'Mental', value: player.stats.mental, icon: <Brain size={12} /> },
                            { label: 'Discipline', value: player.stats.discipline, icon: <Target size={12} /> },
                            { label: 'Knowledge', value: player.stats.knowledge, icon: <BookOpen size={12} /> },
                            { label: 'Wealth', value: player.stats.wealth, icon: <DollarSign size={12} /> },
                            { label: 'Social', value: player.stats.social, icon: <Smile size={12} /> },
                        ].map(stat => (
                            <div key={stat.label} className="flex items-center gap-2 py-1.5 px-2 bg-system-dark/30 border border-system-border/20 rounded-sm">
                                <span className="text-system-blue">{stat.icon}</span>
                                <span className="text-[10px] font-mono text-system-text/70 uppercase flex-1">{stat.label}</span>
                                <span className="text-[11px] font-mono text-system-gold font-bold">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between px-2 py-2 bg-system-dark/30 border border-system-border/20 rounded-sm">
                        <span className="text-[10px] font-mono text-system-text/60 uppercase font-bold">Streak</span>
                        <span className="text-xs font-bold text-system-gold font-mono">{player.streak}D 🔥</span>
                    </div>
                </div>
            )}
        </div>
    );
};
