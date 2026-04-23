import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TrafficLightsProvider } from './context/TrafficLightsContext'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TrafficLightsProvider>
        <App />
      </TrafficLightsProvider>
    </AuthProvider>
  </StrictMode>
)