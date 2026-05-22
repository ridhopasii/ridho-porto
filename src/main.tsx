import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from '@/contexts/DataContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './index.css'
import App from './App.tsx'

// Global error handlers to display errors directly on the screen (useful for debugging blank page issues)
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 24px; background: #fff5f5; color: #c53030; border: 2px solid #fc8181; border-radius: 8px; margin: 20px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">Runtime Error Detected</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Message:</strong> ${event.message}</p>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Location:</strong> ${event.filename}:${event.lineno}:${event.colno}</p>
        <pre style="margin: 12px 0 0 0; padding: 12px; background: #fff; border: 1px solid #fed7d7; border-radius: 4px; overflow-x: auto; font-size: 12px; font-family: monospace; white-space: pre-wrap;">${event.error?.stack || 'No stack trace available'}</pre>
        <button onclick="window.location.reload(true)" style="margin-top: 15px; padding: 8px 16px; background: #c53030; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Reload Page</button>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root');
  if (root) {
    const reasonStr = event.reason instanceof Error ? event.reason.message : String(event.reason);
    const stackStr = event.reason instanceof Error ? event.reason.stack : '';
    root.innerHTML = `
      <div style="padding: 24px; background: #fff5f5; color: #c53030; border: 2px solid #fc8181; border-radius: 8px; margin: 20px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">Promise Rejection Detected</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Reason:</strong> ${reasonStr}</p>
        <pre style="margin: 12px 0 0 0; padding: 12px; background: #fff; border: 1px solid #fed7d7; border-radius: 4px; overflow-x: auto; font-size: 12px; font-family: monospace; white-space: pre-wrap;">${stackStr || 'No stack trace available'}</pre>
        <button onclick="window.location.reload(true)" style="margin-top: 15px; padding: 8px 16px; background: #c53030; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Reload Page</button>
      </div>
    `;
  }
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
