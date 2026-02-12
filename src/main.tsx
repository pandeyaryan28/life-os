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
 * PERF v1.8: Defer service worker registration until after window.onload.
 * This ensures the SW never blocks LCP or initial rendering.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: false,
        onRegistered(registration) {
          if (registration) {
            // Check for updates every hour
            setInterval(() => {
              registration.update()
            }, 60 * 60 * 1000)
          }
        },
        onRegisterError(error) {
          console.error('SW registration error:', error)
        }
      })
    } catch {
      // PWA plugin not available in dev mode, silently ignore
    }
  })
}
