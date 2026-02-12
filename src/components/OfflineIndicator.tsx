import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../context/MobileNavContext';

export const OfflineIndicator: React.FC = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="offline-indicator" role="alert">
            <div className="flex items-center justify-center gap-2">
                <WifiOff size={12} />
                <span>Offline Mode — Data will sync when reconnected</span>
            </div>
        </div>
    );
};
