import { SERVICE_TYPE_CONFIG, ServiceType } from '@/src/domain/types/queue';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { animated, useSpring } from 'react-spring';
import { DisplayTicketTemplateProps } from '../DisplayTicketView';

export function TicketClassicTemplate({
  trackingCode,
  customerName,
  serviceType,
  waitCount,
  qrCodeUrl,
  countdown,
  onDone,
}: DisplayTicketTemplateProps) {
  const serviceConfig = SERVICE_TYPE_CONFIG[serviceType as ServiceType] || SERVICE_TYPE_CONFIG[ServiceType.GENERAL];

  const spring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 30 },
  });

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-white flex flex-col justify-center items-center py-10 px-4 z-[999] selection:bg-blue-500 selection:text-white">
      <animated.div style={spring} className="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 max-w-xl w-full flex flex-col items-center ring-4 ring-white/10 relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ticket-classic-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ticket-classic-pattern)" />
          </svg>
        </div>

        <div className="z-10 text-center w-full">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4 sm:mb-6 ring-8 ring-emerald-50">
            <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">ทำรายการสำเร็จ</h2>
          <p className="text-slate-500 mb-6">คุณ {customerName} ได้รับคิวเรียบร้อยแล้ว</p>

          <div className={`py-4 sm:py-6 px-6 sm:px-10 rounded-2xl mb-6 flex flex-col items-center ${serviceConfig.bgColor} ${serviceConfig.color}`}>
            <span className="text-sm sm:text-base font-medium mb-2 uppercase tracking-wide opacity-80">รหัสคิวของคุณ</span>
            <div className="text-5xl sm:text-7xl font-black tracking-tight">{trackingCode}</div>
          </div>

          <div className="flex bg-slate-50 rounded-2xl p-6 shadow-inner w-full mb-8 items-center justify-between">
            <div className="text-left flex-1">
              <div className="text-sm text-slate-500 font-medium mb-1">คิวที่รออยู่</div>
              <div className="text-3xl font-bold text-slate-800">{waitCount} <span className="text-lg font-normal text-slate-500">คิว</span></div>
            </div>
            <div className="w-px h-16 bg-slate-200 mx-6"></div>
            <div className="text-right flex-1 flex flex-col items-end">
              <div className="text-sm text-slate-500 font-medium mb-1">สแกนดูสถานะ</div>
              {qrCodeUrl ? (
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex-shrink-0">
                  <QRCodeSVG value={qrCodeUrl} size={80} level="M" includeMargin={false} />
                </div>
              ) : (
                <div className="w-[80px] h-[80px] bg-slate-100 rounded-xl animate-pulse"></div>
              )}
            </div>
          </div>

          <button
            onClick={onDone}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-colors group"
          >
            เสร็จสิ้น
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>หน้าจอจะปิดใน {countdown} วินาที</span>
          </div>
        </div>
      </animated.div>
    </div>
  );
}
