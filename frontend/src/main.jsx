/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global Chunk Load Error Handler
// Automatically triggers a hard reload if the user encounters a stale cache (MIME text/html ChunkLoadError)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error intercepted. Forcing hard reload to fetch new bundles...', event);
  window.location.reload(true);
});

// Fallback capture for dynamic import promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.match(/Failed to fetch dynamically imported module/i)) {
    console.warn('ChunkLoadError pattern detected. Forcing hard reload...');
    event.preventDefault();
    window.location.reload(true);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
