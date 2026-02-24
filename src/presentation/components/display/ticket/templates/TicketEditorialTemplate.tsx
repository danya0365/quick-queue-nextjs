import { QRCodeSVG } from 'qrcode.react';
import { animated, useSpring } from 'react-spring';
import { DisplayTicketTemplateProps } from '../DisplayTicketView';

export function TicketEditorialTemplate({
  trackingCode,
  customerName,
  waitCount,
  qrCodeUrl,
  countdown,
  onDone,
}: DisplayTicketTemplateProps) {
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 350, friction: 25 },
  });

  return (
    <div className="fixed inset-0 w-full h-full bg-white text-black flex flex-col justify-center items-center py-10 px-4 sm:px-8 z-[999] font-serif selection:bg-black selection:text-white">
      <animated.div style={spring} className="w-full max-w-4xl border-[4px] sm:border-[8px] border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative flex flex-col md:flex-row h-full max-h-[800px]">
        {/* Left Panel: Ticket Detail */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b-[4px] md:border-b-0 md:border-r-[4px] border-black">
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-8 sm:mb-12">
              QUICK QUEUE • TICKET CONFIRMATION
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              YOUR<br />TICKET
            </h1>
            <div className="w-16 h-[4px] bg-black mb-8 sm:mb-12"></div>
            
            <div className="mb-8">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 block mb-2">
                CUSTOMER NAME
              </span>
              <div className="text-xl sm:text-3xl font-black uppercase tracking-tight">
                {customerName}
              </div>
            </div>

            <div className="flex gap-8 mb-8 sm:mb-0">
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 block mb-2">
                  WAITING
                </span>
                <div className="text-3xl sm:text-5xl font-black uppercase">
                  {waitCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Code & QR */}
        <div className="w-full md:w-[400px] lg:w-[480px] bg-black text-white p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 block mb-4">
            TRACKING CODE
          </span>
          <div className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-12 sm:mb-16">
            {trackingCode}
          </div>

          <div className="bg-white p-4 sm:p-6 mb-12 transform hover:scale-105 transition-transform">
            {qrCodeUrl ? (
              <QRCodeSVG value={qrCodeUrl} size={160} level="M" />
            ) : (
              <div className="w-[160px] h-[160px] bg-gray-200 animate-pulse"></div>
            )}
          </div>
          
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4">
            SCAN TO TRACK
          </span>

          <button
            onClick={onDone}
            className="w-full mt-auto py-4 sm:py-6 border-[2px] border-white text-white font-black uppercase tracking-widest text-sm sm:text-base hover:bg-white hover:text-black transition-colors"
          >
            DONE [{countdown}s]
          </button>
        </div>
      </animated.div>
    </div>
  );
}
