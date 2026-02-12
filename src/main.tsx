import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { MobileNavProvider } from './context/MobileNavContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SubscriptionProvider>
        <MobileNavProvider>
          <App />
        </MobileNavProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </StrictMode>,
)

/**
 * PERF v1.8.2: Defer service worker registration using requestIdleCallback.
 * This ensures the SW never blocks LCP, TTI, or initial rendering.
 * Loaded only after the main thread is completely free.
 */
if ('serviceWorker' in navigator) {
  const registerSWDeferred = async () => {
    try {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: false,
        onRegistered(registration) {
          if (registration) {
            setInterval(() => {
              registration.update()
            }, 60 * 60 * 1000)
          }
        }
      })
    } catch {
      // PWA plugin not available in dev mode
    }
  };

  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => void registerSWDeferred(), { timeout: 10000 });
    } else {
      setTimeout(() => void registerSWDeferred(), 5000);
    }
  });
}
