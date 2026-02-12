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
