import React from 'react';


interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-system-dark text-system-text font-sans selection:bg-system-blue selection:text-white overflow-hidden relative">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{ backgroundImage: 'linear-gradient(var(--system-border) 1px, transparent 1px), linear-gradient(90deg, var(--system-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>

            <main className="relative z-10 container mx-auto p-4 h-screen flex flex-col">
                <header className="flex justify-between items-center py-4 border-b border-system-border mb-6">
                    <h1 className="text-2xl font-mono font-bold text-system-blue tracking-wider uppercase text-glow">
                        Life OS <span className="text-xs text-system-blue opacity-50 font-bold bg-system-blue/10 px-1 rounded-sm ml-1">v1.5.0</span>
                    </h1>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-system-blue/10 border border-system-blue/20 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-system-blue uppercase">Neural Link: Online</span>
                        </div>
                        <div className="text-xs font-mono text-system-gold animate-pulse uppercase">
                            Core Sync Active
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
};
