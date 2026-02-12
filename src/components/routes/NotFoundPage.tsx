import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 404 page for unknown routes under /lifeosplus/*.
 * Does not load any app state. Provides navigation back to dashboard.
 */
export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center max-w-md"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
                >
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                </motion.div>

                {/* Error Code */}
                <h1 className="text-7xl font-black font-mono text-red-500/80 mb-2 tracking-tighter">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-xl font-bold font-mono uppercase tracking-widest text-white/80 mb-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 font-mono mb-8 leading-relaxed">
                    The neural pathway you attempted to access does not exist in the system matrix.
                    This route has no registered handler.
                </p>

                {/* Separator */}
                <div className="h-[1px] w-16 bg-cyan-500/30 mx-auto mb-8" />

                {/* Action Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-[0.98]"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-mono uppercase tracking-wider text-sm">Go to Dashboard</span>
                </button>

                {/* System Path Info */}
                <div className="mt-8 flex justify-center items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                        Route Resolution Failed
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
