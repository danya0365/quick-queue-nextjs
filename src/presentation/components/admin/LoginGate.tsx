'use client';

import { LoginGateClassicLayout } from '@/src/presentation/components/admin/layouts/LoginGateClassicLayout';
import { LoginGateRetroLayout } from '@/src/presentation/components/admin/layouts/LoginGateRetroLayout';
import { useAppTheme } from '@/src/presentation/hooks/useAppTheme';
import { FormEvent, useState } from 'react';
import { useSpring } from 'react-spring';

interface LoginGateProps {
  onLogin: () => void;
}

/**
 * LoginGate - Real login form calling /api/auth/login
 * Authenticates against SQLite via API route
 */
export function LoginGate({ onLogin }: LoginGateProps) {
  const { theme } = useAppTheme();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const logoSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: { tension: 120, friction: 14 },
  });

  const formSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 120, friction: 14 },
    delay: 200,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'เกิดข้อผิดพลาด');
        setIsLoading(false);
        return;
      }

      // Success — session cookie is now set by the server
      onLogin();
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  const layoutProps = {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
    logoSpring,
    formSpring,
  };

  return (
    <>
      {theme === 'retro' ? (
        <LoginGateRetroLayout {...layoutProps} />
      ) : (
        <LoginGateClassicLayout {...layoutProps} />
      )}
    </>
  );
}
