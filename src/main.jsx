import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TrafficLightsProvider } from './context/TrafficLightsContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrafficLightsProvider>
      <App />
    </TrafficLightsProvider>
  </StrictMode>
)