import React, { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { SystemOverlay } from '../SystemOverlay';
import { useGameEngine } from '../../hooks/useGameEngine';

const SystemGuide = lazy(() => import('../SystemGuide').then(m => ({ default: m.SystemGuide })));

const LazyFallback = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
);

export const GuidePage: React.FC = () => {
    const { notifications } = useGameEngine();
    const navigate = useNavigate();

    return (
        <>
            <SystemOverlay notifications={notifications} />
            <Suspense fallback={<LazyFallback />}>
                <SystemGuide isOpen={true} onClose={() => navigate('/lifeosplus/dashboard')} />
            </Suspense>
        </>
    );
};
