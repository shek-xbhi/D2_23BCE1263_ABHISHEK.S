import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Technical Audit Log (V2 Sandbox requirements)
console.log('%c[System Check]', 'color: #075e54; font-weight: bold', 'Initializing GramGrievance v2.0 Service Layer... [OK]');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
