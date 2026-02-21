import { QRCodeSVG } from 'qrcode.react';
import { animated } from 'react-spring';

export interface QRModalRetroTechMagazineTemplateProps {
  onClose: () => void;
  url: string;
  qrSpring: any;
}

export function QRModalRetroTechMagazineTemplate({ onClose, url, qrSpring }: QRModalRetroTechMagazineTemplateProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <animated.div
        style={qrSpring}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#39FF14] p-4 sm:p-8 pt-16 sm:pt-20 border-[4px] sm:border-8 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] sm:shadow-[16px_16px_0_0_rgba(0,0,0,1)] flex flex-col items-center max-w-sm w-full relative transform rotate-1 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-[#FF00FF] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] sm:border-4 border-black font-black text-lg sm:text-xl hover:scale-110 transition-transform shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center z-10"
        >
          X
        </button>
        <h3 className="text-2xl sm:text-3xl font-black uppercase text-black mb-2 bg-white px-3 sm:px-4 border-2 sm:border-4 border-black transform -rotate-2">
          รับคิวออนไลน์
        </h3>
        <p className="text-[10px] sm:text-sm font-bold text-black mb-4 sm:mb-6 text-center uppercase">
          สแกน QR Code เพื่อรับตั๋วคิวดิจิทัลของคุณ
        </p>
        <div className="bg-white p-3 sm:p-4 border-[3px] sm:border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-[240px] aspect-square flex justify-center items-center">
          <QRCodeSVG
            value={url}
            style={{ width: '100%', height: '100%' }}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs font-bold bg-black text-white px-3 sm:px-4 py-2 uppercase tracking-widest truncate w-full text-center">
          {url}
        </p>
      </animated.div>
    </div>
  );
}
