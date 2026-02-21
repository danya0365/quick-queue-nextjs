import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface LoginGateEditorialTemplateProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string;
  isLoading: boolean;
  handleSubmit: (e: FormEvent) => void;
  logoSpring: any;
  formSpring: any;
}

export function LoginGateEditorialTemplate({
  username,
  setUsername,
  password,
  setPassword,
  error,
  isLoading,
  handleSubmit,
  logoSpring,
  formSpring,
}: LoginGateEditorialTemplateProps) {
  return (
    <div className="min-h-full flex items-center justify-center p-4 font-serif bg-white text-black selection:bg-black selection:text-white">
      <div className="w-full max-w-lg border-[8px] border-black p-8 sm:p-12 relative">
        {/* Editorial Decorative Corner Line */}
        <div className="absolute top-0 left-0 w-16 h-[8px] bg-black -translate-y-[16px]"></div>
        <div className="absolute top-0 right-0 w-[8px] h-16 bg-black translate-x-[16px] -translate-y-[8px]"></div>

        <animated.div style={logoSpring} className="text-left mb-12 border-b-[6px] border-black pb-8">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            AUTH
            <br />
            <span className="text-white bg-black px-2">ENTRY</span>
          </h1>
          <div className="inline-block font-sans font-bold uppercase text-xs sm:text-sm tracking-widest border-[3px] border-black px-3 py-1">
            STAFF ONLY CREDENTIALS
          </div>
        </animated.div>

        <animated.div style={formSpring} className="font-sans">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col">
              <label className="text-xl font-black uppercase tracking-tighter mb-2">
                IDENTITY.
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-white border-[6px] border-black text-xl font-bold placeholder:text-gray-300 focus:outline-none focus:bg-gray-100 transition-colors"
                placeholder="USERNAME"
                autoFocus
                id="login-username"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl font-black uppercase tracking-tighter mb-2">
                KEY.
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white border-[6px] border-black text-xl font-bold placeholder:text-gray-300 focus:outline-none focus:bg-gray-100 transition-colors tracking-widest"
                placeholder="PASSWORD"
                id="login-password"
              />
            </div>

            {error && (
              <div className="text-white font-bold bg-black border-[4px] border-black px-5 py-4 uppercase text-sm tracking-widest text-center">
                ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-white hover:text-black border-[6px] border-black px-6 py-5 font-black uppercase tracking-widest text-xl transition-all active:translate-y-1 mt-4"
            >
              {isLoading ? 'VERIFYING...' : 'LOGIN'}
            </button>
          </form>

          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-10 pt-6 border-t-[4px] border-black text-center">
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
                DEMO: admin / admin
              </p>
            </div>
          )}
        </animated.div>
      </div>
    </div>
  );
}
