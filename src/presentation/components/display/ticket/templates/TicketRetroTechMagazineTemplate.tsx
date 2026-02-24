import { QRCodeSVG } from 'qrcode.react';
import { animated, useSpring } from 'react-spring';
import { DisplayTicketTemplateProps } from '../DisplayTicketView';

export function TicketRetroTechMagazineTemplate({
  trackingCode,
  customerName,
  waitCount,
  qrCodeUrl,
  countdown,
  onDone,
}: DisplayTicketTemplateProps) {
  const spring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 350, friction: 20 },
  });

  return (
    <div className="fixed inset-0 w-full h-full bg-[#FFFF00] text-black flex flex-col justify-center items-center p-4 sm:p-8 z-[999] font-sans selection:bg-[#FF00FF] selection:text-white">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <animated.div style={spring} className="w-full max-w-2xl bg-white border-[6px] border-black shadow-[16px_16px_0_0_rgba(255,0,255,1)] flex flex-col relative z-10 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#00FFFF] border-b-[6px] border-black px-4 sm:px-6 py-3 flex justify-between items-center">
          <span className="font-black text-xl uppercase tracking-widest">TICKET.ACQUIRED_</span>
          <span className="bg-black text-[#00FFFF] px-3 py-1 text-xs font-bold font-mono border-2 border-transparent">
            STATUS: OK
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-stretch">
          
          <div className="flex-1 flex flex-col w-full text-center md:text-left">
            <div className="mb-6 sm:mb-8 border-[4px] border-black p-4 bg-[#FF00FF] text-white transform -rotate-2 hover:rotate-0 transition-transform">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest block mb-1 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                TRACKING.CODE_
              </span>
              <div className="text-5xl sm:text-7xl font-black tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                {trackingCode}
              </div>
            </div>

            <div className="font-mono text-sm sm:text-base font-bold mb-4 bg-black text-[#00FFFF] p-3 inline-block self-center md:self-start">
              <span className="opacity-80">USER:</span> {customerName}
            </div>

            <div className="mt-auto pt-6 border-t-[4px] border-black border-dashed flex items-center justify-between font-black uppercase text-xl sm:text-2xl mt-8">
              <span>WAITING:</span>
              <span className="text-white bg-black px-4 py-2 text-3xl sm:text-4xl shadow-[4px_4px_0_0_rgba(0,255,255,1)]">
                {waitCount}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto">
            <div className="border-[6px] border-black bg-white p-3 sm:p-4 shadow-[8px_8px_0_0_rgba(0,255,255,1)] mb-6 transform hover:scale-105 transition-transform group">
              {qrCodeUrl ? (
                <QRCodeSVG value={qrCodeUrl} size={180} level="M" fgColor="#000000" />
              ) : (
                <div className="w-[180px] h-[180px] bg-gray-200"></div>
              )}
            </div>
            <div className="bg-black text-[#FFFF00] px-4 py-2 font-black uppercase tracking-widest text-sm animate-pulse">
              SCAN.TO.TRACK
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="border-t-[6px] border-black flex">
          <button
            onClick={onDone}
            className="flex-1 py-4 sm:py-5 bg-[#FF00FF] hover:bg-[#00FFFF] text-white hover:text-black font-black uppercase text-lg sm:text-xl transition-colors text-center border-r-[3px] border-black"
          >
            DONE
          </button>
          <div className="w-[120px] bg-black text-white flex items-center justify-center font-mono font-bold text-xl border-l-[3px] border-black">
            T-{countdown}
          </div>
        </div>
        
      </animated.div>
    </div>
  );
}
