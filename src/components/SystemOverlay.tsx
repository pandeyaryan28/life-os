import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '../types';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface SystemOverlayProps {
    notifications: Notification[];
}

export const SystemOverlay: React.FC<SystemOverlayProps> = ({ notifications }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 50, transition: { duration: 0.2 } }}
                        className={`p-3 border-l-4 bg-system-panel/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto flex items-start gap-3 border-system-border
              ${notif.type === 'SUCCESS' ? 'border-green-500/50 bg-green-500/5' : ''}
              ${notif.type === 'FAILURE' ? 'border-system-danger/50 bg-system-danger/5' : ''}
              ${notif.type === 'WARNING' ? 'border-system-gold/50 bg-system-gold/5' : ''}
              ${notif.type === 'INFO' ? 'border-system-blue/50 bg-system-blue/5' : ''}
            `}
                    >
                        <div className={`mt-0.5 ${notif.type === 'SUCCESS' ? 'text-green-400' :
                                notif.type === 'FAILURE' ? 'text-system-danger' :
                                    notif.type === 'WARNING' ? 'text-system-gold' : 'text-system-blue'
                            }`}>
                            {notif.type === 'SUCCESS' && <CheckCircle size={18} />}
                            {notif.type === 'FAILURE' && <XCircle size={18} />}
                            {notif.type === 'WARNING' && <AlertCircle size={18} />}
                            {notif.type === 'INFO' && <Info size={18} />}
                        </div>
                        <div className="flex-1">
                            <p className={`font-mono text-[10px] font-bold uppercase tracking-widest mb-1 ${notif.type === 'SUCCESS' ? 'text-green-400/60' :
                                    notif.type === 'FAILURE' ? 'text-system-danger/60' :
                                        notif.type === 'WARNING' ? 'text-system-gold/60' : 'text-system-blue/60'
                                }`}>
                                {notif.type}
                            </p>
                            <p className="text-sm text-system-text font-medium leading-tight">{notif.message}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

