'use client';

import { AnimatedButton } from '@/src/presentation/components/shared/AnimatedButton';
import { GlassCard } from '@/src/presentation/components/shared/GlassCard';
import { FormEvent, useState } from 'react';
import { animated, useSpring } from 'react-spring';

interface LoginGateProps {
  onLogin: () => void;
}

/**
 * LoginGate - Real login form calling /api/auth/login
 * Authenticates against SQLite via API route
 */
export function LoginGate({ onLogin }: LoginGateProps) {
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

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <animated.div style={logoSpring} className="text-center mb-8">
          <div className="
            w-16 h-16 rounded-2xl mx-auto mb-4
            bg-gradient-to-br from-primary to-accent
            flex items-center justify-center
            shadow-lg
          ">
            <span className="text-white font-bold text-2xl">QQ</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold">เข้าสู่ระบบ</h1>
          <p className="text-muted text-sm mt-1">สำหรับเจ้าของร้านเท่านั้น</p>
        </animated.div>

        {/* Login Form */}
        <animated.div style={formSpring}>
          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-surface-alt border border-border
                    text-foreground text-sm
                    placeholder:text-muted-light
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                    transition-all duration-200
                  "
                  placeholder="username"
                  autoFocus
                  id="login-username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-surface-alt border border-border
                    text-foreground text-sm
                    placeholder:text-muted-light
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                    transition-all duration-200
                  "
                  placeholder="password"
                  id="login-password"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              <AnimatedButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {}}
                id="login-submit"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </AnimatedButton>
            </form>

            <div className="mt-4 text-center">
              <p className="text-muted text-xs">
                Demo: <code className="bg-surface-alt px-1.5 py-0.5 rounded text-foreground">admin</code> / <code className="bg-surface-alt px-1.5 py-0.5 rounded text-foreground">admin</code>
              </p>
            </div>
          </GlassCard>
        </animated.div>
      </div>
    </div>
  );
}
