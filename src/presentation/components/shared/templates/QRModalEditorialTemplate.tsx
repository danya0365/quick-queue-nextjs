import { QRCodeSVG } from 'qrcode.react';
import { animated } from 'react-spring';

export interface QRModalEditorialTemplateProps {
  onClose: () => void;
  url: string;
  qrSpring: any;
}

export function QRModalEditorialTemplate({ onClose, url, qrSpring }: QRModalEditorialTemplateProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <animated.div
        style={qrSpring}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 sm:p-12 pt-16 sm:pt-20 border-[4px] sm:border-[8px] border-black flex flex-col items-center max-w-sm w-full relative shadow-[12px_12px_0_0_rgba(0,0,0,1)] sm:shadow-[24px_24px_0_0_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black text-white w-10 h-10 sm:w-14 sm:h-14 rounded-full border-[4px] sm:border-[6px] border-white font-black text-xl sm:text-2xl hover:scale-110 transition-transform shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center z-10"
        >
          X
        </button>
        <h3 className="text-3xl sm:text-5xl font-black uppercase text-black mb-3 sm:mb-4 tracking-tighter w-full text-center border-b-[4px] sm:border-b-[6px] border-black pb-4 sm:pb-6">
          ตั๋วดิจิทัล
        </h3>
        <p className="text-[10px] sm:text-sm font-bold text-gray-500 mb-6 sm:mb-10 text-center uppercase tracking-widest">
          สแกนเพื่อรับคิวของคุณผ่านทางออนไลน์
        </p>
        <div className="bg-white p-4 sm:p-6 border-[4px] sm:border-[6px] border-black w-full max-w-[280px] aspect-square flex justify-center items-center">
          <QRCodeSVG
            value={url}
            style={{ width: '100%', height: '100%' }}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        <p className="mt-6 sm:mt-10 text-[10px] sm:text-xs font-bold bg-black text-white px-4 sm:px-6 py-2 sm:py-3 uppercase tracking-widest truncate w-full text-center border-[2px] sm:border-[4px] border-black">
          {url}
        </p>
      </animated.div>
    </div>
  );
}
