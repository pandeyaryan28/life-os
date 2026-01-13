import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, Repeat, History, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Expense } from '../types';

interface ExpensesPanelProps {
    credits: number;
    expenseHistory: Expense[];
    recurringExpenses: Expense[];
    onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
}

export const ExpensesPanel: React.FC<ExpensesPanelProps> = ({
    credits,
    expenseHistory,
    recurringExpenses,
    onAddExpense
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState('General');
    const [type, setType] = useState<'ONE_TIME' | 'RECURRING'>('ONE_TIME');
    const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');
    const [notes, setNotes] = useState('');

    const todayNetChange = useMemo(() => {
        const today = new Date().toDateString();
        return expenseHistory
            .filter(e => new Date(e.timestamp).toDateString() === today)
            .reduce((sum, e) => sum + (e.amount || 0), 0);
    }, [expenseHistory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddExpense({
            name,
            amount,
            category,
            type,
            frequency: type === 'RECURRING' ? frequency : undefined,
            notes: notes || undefined
        });
        setIsAdding(false);
        setName('');
        setAmount(0);
        setNotes('');
    };

    return (
        <div className="bg-system-panel border border-system-border rounded-sm shadow-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-system-border bg-system-dark/30 flex justify-between items-center">
                <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase flex items-center gap-2">
                    <DollarSign size={16} className="text-system-gold" />
                    Economy System
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="p-1 hover:bg-system-blue/10 rounded-sm text-system-blue transition-colors border border-system-blue/30"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4 bg-system-dark/20 border-b border-system-border">
                <div className="space-y-1">
                    <p className="text-[10px] font-mono text-system-text/40 uppercase">Balance</p>
                    <p className="text-xl font-black text-system-gold font-mono">{credits.toLocaleString()} <span className="text-xs opacity-50">C</span></p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-mono text-system-text/40 uppercase">Today's Spends</p>
                    <p className="text-xl font-black font-mono text-white">
                        {todayNetChange.toLocaleString()} <span className="text-xs opacity-50">C</span>
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Recurring Subscriptions */}
                {recurringExpenses.length > 0 && (
                    <div>
                        <h3 className="text-[10px] font-mono text-system-blue uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Repeat size={12} /> Recurring Deductions
                        </h3>
                        <div className="space-y-2">
                            {recurringExpenses.map(exp => (
                                <div key={exp.id} className="p-3 bg-system-dark/50 border border-system-border/50 rounded-sm flex justify-between items-center group hover:border-system-blue/30 transition-colors">
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">{exp.name}</p>
                                        <p className="text-[9px] font-mono text-system-text/40">{exp.frequency} • {exp.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-system-danger font-mono">-{exp.amount} C</p>
                                        <p className="text-[8px] font-mono text-system-text/30">NEXT: AUTO</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* History */}
                <div>
                    <h3 className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <History size={12} /> Transaction Ledger
                    </h3>
                    <div className="space-y-1">
                        {expenseHistory.length === 0 ? (
                            <div className="py-8 text-center text-[10px] font-mono text-system-text/20 uppercase">No records found</div>
                        ) : (
                            expenseHistory
                                .slice()
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .map(exp => (
                                    <div key={exp.id} className="flex justify-between items-center py-2 border-b border-system-border/20 last:border-0 hover:bg-white/5 px-2 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-system-danger/10 text-system-danger rounded-sm">
                                                <TrendingDown size={12} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-white uppercase leading-none mb-1">{exp.name}</p>
                                                <p className="text-[9px] font-mono text-system-text/40">{new Date(exp.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-system-danger font-mono">-{exp.amount}</p>
                                            <p className="text-[8px] font-mono text-system-text/30 uppercase">{exp.category}</p>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Expense Modal Overly */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-system-dark/95 backdrop-blur-sm p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                                <Plus size={16} className="text-system-blue" />
                                Log Real-World Expense
                            </h3>
                            <button onClick={() => setIsAdding(false)} className="text-system-text/40 hover:text-white transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Expense Name</label>
                                <input
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-system-panel border border-system-border p-2 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    placeholder="e.g. Rent, Coffee, Gym..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Amount (Numeric)</label>
                                    <input
                                        required
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(Number(e.target.value))}
                                        className="w-full bg-system-panel border border-system-border p-2 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Category</label>
                                    <input
                                        required
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-system-panel border border-system-border p-2 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value as any)}
                                        className="w-full bg-system-panel border border-system-border p-2 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    >
                                        <option value="ONE_TIME">ONE-TIME</option>
                                        <option value="RECURRING">RECURRING</option>
                                    </select>
                                </div>
                                {type === 'RECURRING' && (
                                    <div>
                                        <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Frequency</label>
                                        <select
                                            value={frequency}
                                            onChange={e => setFrequency(e.target.value as any)}
                                            className="w-full bg-system-panel border border-system-border p-2 font-mono text-xs text-white focus:border-system-blue outline-none"
                                        >
                                            <option value="DAILY">DAILY</option>
                                            <option value="WEEKLY">WEEKLY</option>
                                            <option value="MONTHLY">MONTHLY</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Optional Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full bg-system-panel border border-system-border p-2 font-mono text-[10px] text-white focus:border-system-blue outline-none h-16 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-system-danger/20 hover:bg-system-danger/40 border border-system-danger text-system-danger font-black uppercase tracking-[0.2em] transition-all text-xs"
                            >
                                Deduct & Record Transaction
                            </button>
                            <p className="text-[8px] font-mono text-system-text/30 text-center uppercase tracking-tighter">
                                Warning: Deductions are permanent and audited in the ledger.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
