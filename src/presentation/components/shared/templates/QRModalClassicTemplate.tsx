import { QRCodeSVG } from 'qrcode.react';
import { animated } from 'react-spring';

export interface QRModalClassicTemplateProps {
  onClose: () => void;
  url: string;
  qrSpring: any;
}

export function QRModalClassicTemplate({ onClose, url, qrSpring }: QRModalClassicTemplateProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <animated.div
        style={qrSpring}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 sm:p-8 pt-12 sm:pt-14 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col items-center max-w-[280px] sm:max-w-sm w-full relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-800 text-lg sm:text-xl z-10 bg-white/50 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4">
          📱
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">สแกนเพื่อรับคิว</h3>
        <p className="text-[10px] sm:text-sm text-gray-500 mb-4 sm:mb-6 text-center leading-tight">
          ใช้กล้องมือถือสแกน QR Code เพื่อเช็คคิวของคุณแบบเรียลไทม์
        </p>
        <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-100 shadow-inner w-full max-w-[200px] aspect-square flex items-center justify-center">
          <QRCodeSVG
            value={url}
            style={{ width: '100%', height: '100%' }}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-100 truncate w-full text-center">
          {url}
        </p>
      </animated.div>
    </div>
  );
}
