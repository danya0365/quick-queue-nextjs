import { FormEvent } from 'react';
import { animated } from 'react-spring';

export interface LoginGateRetroTechMagazineTemplateProps {
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

export function LoginGateRetroTechMagazineTemplate({
  username,
  setUsername,
  password,
  setPassword,
  error,
  isLoading,
  handleSubmit,
  logoSpring,
  formSpring,
}: LoginGateRetroTechMagazineTemplateProps) {
  return (
    <div
      className="min-h-full flex items-center justify-center p-4 font-sans selection:bg-[#FF00FF] selection:text-white"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#fff',
      }}
    >
      <div className="w-full max-w-md relative">
        {/* Background Decorative Box */}
        <div className="absolute inset-0 bg-[#00FFFF] translate-x-4 translate-y-4 border-4 border-white"></div>
        
        {/* Main Content Box */}
        <div className="bg-black border-4 border-white p-6 sm:p-10 relative z-10">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-white"></div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-white"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-white"></div>

          <animated.div style={logoSpring} className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest text-[#FF00FF] drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">
              SYS_LOGIN
            </h1>
            <div className="inline-block bg-white text-black font-bold uppercase text-xs tracking-widest px-2 py-1 mt-2 transform -skew-x-12">
              AUTHORIZED PERSONNEL ONLY
            </div>
          </animated.div>

          <animated.div style={formSpring}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#39FF14] mb-2 uppercase tracking-widest">
                  &gt; IDENTIFICATION
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full px-4 py-3
                    bg-black border-2 border-white
                    text-white font-mono
                    placeholder:text-gray-600
                    focus:outline-none focus:border-[#39FF14] focus:shadow-[0_0_10px_rgba(57,255,20,0.5)]
                    transition-all
                  "
                  placeholder="ENTER_USERNAME_"
                  autoFocus
                  id="login-username"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#39FF14] mb-2 uppercase tracking-widest">
                  &gt; SECURITY CODES
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-3
                    bg-black border-2 border-white
                    text-white font-mono tracking-widest
                    placeholder:text-gray-600
                    focus:outline-none focus:border-[#39FF14] focus:shadow-[0_0_10px_rgba(57,255,20,0.5)]
                    transition-all
                  "
                  placeholder="********"
                  id="login-password"
                />
              </div>

              {error && (
                <div className="text-white font-bold bg-[#FF00FF] border-2 border-white px-4 py-3 uppercase text-sm animate-pulse tracking-widest text-center shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
                  ⚠ ERR: {error}
                </div>
              )}

              <button
                type="submit"
                className="
                  w-full bg-white text-black border-4 border-white
                  px-6 py-4 font-black uppercase tracking-widest text-lg
                  hover:bg-[#FF00FF] hover:text-white hover:border-[#FF00FF]
                  transition-all active:translate-y-1 mt-4
                  shadow-[4px_4px_0_0_rgba(0,255,255,1)]
                "
              >
                {isLoading ? 'ESTABLISHING CONN...' : 'GRANT ACCESS'}
              </button>
            </form>

            <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-600 text-center">
              <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
                DEMO CONFIG: admin / admin
              </p>
            </div>
          </animated.div>
        </div>
      </div>
    </div>
  );
}
