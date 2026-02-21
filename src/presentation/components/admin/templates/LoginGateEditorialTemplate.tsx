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
    <div className="min-h-full flex items-center justify-center p-6 sm:p-8 font-serif bg-white text-black selection:bg-black selection:text-white">
      <div className="w-full max-w-md border-[6px] border-black p-5 sm:p-8 relative shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
        {/* Print-style Crop Marks */}
        <div className="absolute -top-[20px] -left-[6px] w-[6px] h-[20px] bg-black"></div>
        <div className="absolute -top-[6px] -left-[20px] w-[20px] h-[6px] bg-black"></div>
        <div className="absolute -bottom-[20px] -right-[6px] w-[6px] h-[20px] bg-black"></div>
        <div className="absolute -bottom-[6px] -right-[20px] w-[20px] h-[6px] bg-black"></div>

        <animated.div style={logoSpring} className="text-left mb-6 border-b-[4px] border-black pb-4">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-2 flex items-center flex-wrap gap-2">
            <span>เข้าสู่</span>
            <span className="text-white bg-black px-3 py-1 inline-block">ระบบ</span>
          </h1>
          <div className="inline-block font-sans font-bold uppercase text-[10px] sm:text-xs tracking-widest border-[2px] border-black px-2 py-1 mt-1">
            สำหรับเจ้าหน้าที่เท่านั้น
          </div>
        </animated.div>

        <animated.div style={formSpring} className="font-sans">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm sm:text-base font-black uppercase tracking-tighter mb-1">
                ชื่อผู้ใช้.
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white border-[4px] border-black text-base sm:text-lg font-bold placeholder:text-gray-300 focus:outline-none focus:bg-gray-100 transition-colors"
                placeholder="USERNAME"
                autoFocus
                id="login-username"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm sm:text-base font-black uppercase tracking-tighter mb-1">
                รหัสผ่าน.
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border-[4px] border-black text-base sm:text-lg font-bold placeholder:text-gray-300 focus:outline-none focus:bg-gray-100 transition-colors tracking-widest"
                placeholder="PASSWORD"
                id="login-password"
              />
            </div>

            {error && (
              <div className="text-white font-bold bg-black border-[4px] border-black px-4 py-2 uppercase text-xs sm:text-sm tracking-widest text-center">
                ข้อผิดพลาด: {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-white hover:text-black border-[4px] border-black px-4 py-3 font-black uppercase tracking-widest text-base sm:text-lg transition-all active:translate-y-1 active:shadow-none mt-4"
            >
              {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-6 pt-4 border-t-[4px] border-black flex justify-between items-center text-[10px] sm:text-xs uppercase font-bold tracking-widest">
              <span>SYS.TEST</span>
              <span className="bg-black text-white px-2 py-1">admin / admin</span>
            </div>
          )}
        </animated.div>
      </div>
    </div>
  );
}
