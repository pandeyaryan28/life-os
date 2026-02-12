import React, { useState } from 'react';
import type { GameState } from '../../types';
import { Terminal, Settings as SettingsIcon, BarChart3, RefreshCw, XCircle, Calendar as CalendarIcon, BookOpen } from 'lucide-react';

interface SystemStatusPanelProps {
    gameState: GameState;
    updateSettings: (settings: Partial<GameState['settings']>) => void;
    onOpenGuide: () => void;
    onSetSummaryType: (type: 'WEEKLY' | 'MONTHLY') => void;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
    gameState,
    updateSettings,
    onOpenGuide,
    onSetSummaryType
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="bg-system-panel border border-system-border p-4 rounded-sm flex-1 space-y-4 shadow-xl">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-system-text/40 uppercase tracking-widest">
                    <Terminal size={12} /> System Status
                </div>
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`p-2 rounded-sm transition-colors tap-feedback ${isSettingsOpen ? 'bg-system-blue text-white' : 'bg-system-dark/50 text-system-text/40 hover:text-white'}`}
                >
                    <SettingsIcon size={14} />
                </button>
            </div>

            {isSettingsOpen ? (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="flex items-center justify-between cursor-pointer group py-2">
                            <span className="text-[9px] font-mono text-system-text/60 group-hover:text-white transition-colors flex items-center gap-2 uppercase">
                                <RefreshCw size={10} /> Auto-Renew Dailies
                            </span>
                            <input
                                type="checkbox"
                                checked={gameState.settings.autoRenewDailies}
                                onChange={(e) => updateSettings({ autoRenewDailies: e.target.checked })}
                                className="accent-system-blue w-5 h-5"
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group py-2">
                            <span className="text-[9px] font-mono text-system-text/60 group-hover:text-white transition-colors flex items-center gap-2 uppercase">
                                <XCircle size={10} /> Auto-Failure Detect
                            </span>
                            <input
                                type="checkbox"
                                checked={gameState.settings.autoFailureDetection}
                                onChange={(e) => updateSettings({ autoFailureDetection: e.target.checked })}
                                className="accent-system-blue w-5 h-5"
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <button
                        onClick={onOpenGuide}
                        className="w-full py-3 border border-system-blue/30 hover:border-system-blue bg-system-blue/5 text-system-blue/60 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 group tap-feedback"
                    >
                        <BookOpen size={14} />
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">System Guide</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => onSetSummaryType('WEEKLY')}
                            className="bg-system-dark/50 border border-system-border p-3 rounded-sm hover:border-system-gold/50 transition-colors flex flex-col items-start gap-1 tap-feedback"
                        >
                            <BarChart3 size={12} className="text-system-gold opacity-50" />
                            <div className="text-[9px] font-bold text-white font-mono uppercase">Weekly</div>
                        </button>
                        <button
                            onClick={() => onSetSummaryType('MONTHLY')}
                            className="bg-system-dark/50 border border-system-border p-3 rounded-sm hover:border-system-blue/50 transition-colors flex flex-col items-start gap-1 tap-feedback"
                        >
                            <CalendarIcon size={12} className="text-system-blue opacity-50" />
                            <div className="text-[9px] font-bold text-white font-mono uppercase">Monthly</div>
                        </button>
                    </div>

                    <div className="bg-system-dark/30 border border-system-border/30 p-3 rounded-sm flex justify-between items-center">
                        <div className="text-[9px] text-system-text/40 font-mono uppercase">Streak</div>
                        <div className="text-sm font-bold text-system-gold">{gameState.player.streak}D 🔥</div>
                    </div>

                    <div className="bg-system-dark/30 border border-system-border/30 p-3 rounded-sm flex justify-between items-center">
                        <div className="text-[9px] text-system-text/40 font-mono uppercase">System Version</div>
                        <div className="text-[10px] font-mono text-system-blue font-bold">LIFE OS v1.7.5</div>
                    </div>
                </div>
            )}
        </div>
    );
};
