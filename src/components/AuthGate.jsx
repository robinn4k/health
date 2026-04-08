import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function AuthGate({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Loading
  if (user === undefined) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="font-display text-[28px] font-bold" style={{ color: 'var(--gold)' }}>
            Plan Fitness
          </div>
          <p className="font-mono text-[11px] mt-2" style={{ color: 'var(--text3)' }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginScreen />;
  }

  // Logged in — pass user down
  return children(user);
}

function LoginScreen() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-[320px]">
        {/* Logo */}
        <p className="font-mono text-[10px] font-semibold tracking-[4px] uppercase" style={{ color: 'var(--gold)' }}>
          Push & Pull
        </p>
        <h1
          className="font-display text-[40px] font-extrabold leading-tight mt-1"
          style={{
            background: 'linear-gradient(135deg, var(--text) 40%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Plan Fitness
        </h1>
        <p className="font-mono text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text3)' }}>
          Nutrición + Entrenamiento personal
        </p>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-8 w-full py-4 rounded-2xl border font-mono text-[13px] font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
          style={{
            background: 'var(--gold-dim)',
            borderColor: 'var(--border-gold)',
            color: 'var(--gold)',
            opacity: loading ? 0.5 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'CONECTANDO...' : 'INICIAR CON GOOGLE'}
        </button>

        {error && (
          <p className="mt-3 font-mono text-[10px]" style={{ color: 'var(--prot)' }}>
            {error}
          </p>
        )}

        <p className="mt-6 font-mono text-[9px]" style={{ color: 'var(--text3)' }}>
          Tus datos se guardan en Firebase de forma segura
        </p>
      </div>
    </div>
  );
}

export function useLogout() {
  return () => signOut(auth);
}
