import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import AuthGate from './components/AuthGate';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthGate>
      {(user) => <App user={user} />}
    </AuthGate>
  </StrictMode>
);

// Register service worker with auto-update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/health/sw.js').then(reg => {
      setInterval(() => reg.update(), 60 * 1000);
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'activated') {
            window.location.reload();
          }
        });
      });
    });
  });
}
