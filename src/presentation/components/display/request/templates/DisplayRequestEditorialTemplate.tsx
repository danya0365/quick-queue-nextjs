'use client';

import { ServiceType } from '@/src/domain/types/queue';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Crown, Lock, Send, Ticket, Zap } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { DisplayRequestTemplateProps, RequestStep } from '../DisplayRequestView';

const STEPS: { key: RequestStep; label: string }[] = [
  { key: 'info', label: 'ข้อมูล' },
  { key: 'verify', label: 'ยืนยันตัวตน' },
  { key: 'preview', label: 'ตรวจสอบ' },
];

export function DisplayRequestEditorialTemplate({
  currentStep, setCurrentStep, customerName, setCustomerName, serviceType, setServiceType,
  note, setNote, challenge, challengeAnswer, setChallengeAnswer, isSubmitting, error,
  successCode, qrCodeUrl, countdown, handleDone, handleSubmit, canGoNext, presets,
}: DisplayRequestTemplateProps) {
  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  if (successCode) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white text-black font-serif p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 border-4 border-black mx-auto flex items-center justify-center mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-3">สำเร็จ</h1>
          <p className="text-gray-500 font-bold uppercase text-sm tracking-widest mb-10">ขอคิวเรียบร้อย</p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-10">
            {/* Tracking Code */}
            <div className="border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex-1 w-full bg-white">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">รหัสเช็คคิว</div>
              <div className="text-4xl sm:text-5xl font-black tracking-[0.25em] font-mono select-all">{successCode}</div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="border-4 border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] shrink-0 bg-white">
                <QRCodeSVG value={qrCodeUrl} size={110} level="H" includeMargin={false} />
                <div className="text-[10px] font-black uppercase tracking-widest mt-2">สแกนเช็คคิว</div>
              </div>
            )}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">
            กลับหน้าหลักอัตโนมัติใน {countdown} วินาที
          </p>

          <button onClick={handleDone} className="inline-flex items-center gap-2 px-8 py-4 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors text-sm font-sans mx-auto shadow-[4px_4px_0_0_rgba(0,0,0,0.15)]">
            <ArrowLeft className="w-5 h-5" /> กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col bg-white text-black font-serif">
      <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b-4 border-black shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/display" className="flex items-center gap-1.5 p-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-sans">
            <ArrowLeft className="w-5 h-5" /><span className="hidden sm:inline text-xs font-black uppercase tracking-widest">กลับ</span>
          </Link>
          <Ticket className="w-5 h-5" />
          <h1 className="text-lg font-black uppercase tracking-tighter font-sans">รับคิว</h1>
        </div>
      </header>

      <div className="px-4 sm:px-8 py-3 bg-gray-50 border-b-2 border-black shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between font-sans">
          {STEPS.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              <button onClick={() => { if (idx < stepIndex) setCurrentStep(step.key); }} disabled={idx > stepIndex}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  idx === stepIndex ? 'border-2 border-black bg-black text-white' : idx < stepIndex ? 'border-2 border-black cursor-pointer hover:bg-gray-100' : 'border-2 border-gray-200 text-gray-300 cursor-not-allowed'
                }`}>{idx + 1}. {step.label}</button>
              {idx < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-2 ${idx < stepIndex ? 'bg-black' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto bg-gray-50">
        <div className="w-full max-w-lg font-sans">
          {error && <div className="mb-6 border-2 border-black bg-red-50 p-4 text-sm text-red-800 font-bold">{error}</div>}
          <form onSubmit={handleSubmit}>
            {currentStep === 'info' && (
              <div className="space-y-6">
                <div className="text-center mb-8 font-serif">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">กรอกข้อมูล</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 font-sans">กรอกข้อมูลของท่านด้านล่าง</p>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">ชื่อของคุณ <span className="text-red-500">*</span></label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} autoFocus
                    className="w-full px-4 py-3.5 border-2 border-black bg-white placeholder:text-gray-300 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all text-base font-bold" placeholder="กรอกชื่อของคุณ" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {presets.customerNames.map((p) => <button key={p} type="button" onClick={() => setCustomerName(p)} className="px-3 py-1.5 text-xs border border-black text-gray-500 hover:bg-black hover:text-white transition-all font-bold uppercase">+ {p}</button>)}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">ประเภทบริการ</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ value: ServiceType.GENERAL, label: 'GENERAL', icon: <ClipboardList className="w-5 h-5" /> }, { value: ServiceType.EXPRESS, label: 'EXPRESS', icon: <Zap className="w-5 h-5" /> }, { value: ServiceType.VIP, label: 'VIP', icon: <Crown className="w-5 h-5" /> }].map((o) => (
                      <button key={o.value} type="button" onClick={() => setServiceType(o.value)}
                        className={`flex flex-col items-center gap-2 py-4 px-3 border-2 transition-all font-black text-xs uppercase ${serviceType === o.value ? 'border-black bg-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]' : 'border-black text-gray-400 hover:bg-gray-100'}`}>
                        {o.icon}{o.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">ข้อความเพิ่มเติม <span className="text-gray-300 font-normal">(ไม่บังคับ)</span></label>
                  <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-black bg-white placeholder:text-gray-300 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all text-base font-bold" placeholder="ข้อมูลเพิ่มเติม..." />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {presets.notes.map((p) => <button key={p} type="button" onClick={() => setNote((prev) => (prev ? prev + ' ' + p : p))} className="px-3 py-1.5 text-xs border border-black text-gray-500 hover:bg-black hover:text-white transition-all font-bold uppercase">+ {p}</button>)}
                  </div>
                </div>
                <button type="button" disabled={!canGoNext} onClick={() => setCurrentStep('verify')}
                  className="w-full mt-4 py-4 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-[6px_6px_0_0_rgba(0,0,0,0.15)]">
                  ถัดไป <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {currentStep === 'verify' && (
              <div className="space-y-6">
                <div className="text-center mb-8 font-serif">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">ยืนยันตัวตน</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 font-sans">ตอบคำถามเพื่อยืนยัน</p>
                </div>
                <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-2 mb-6 text-gray-400 text-xs font-black uppercase tracking-widest"><Lock className="w-4 h-4" /> ป้องกันบอท</div>
                  {challenge ? (
                    <div className="space-y-4">
                      <div className="text-center"><div className="inline-block text-4xl font-black bg-gray-100 px-8 py-4 border-2 border-black">{challenge.question}</div></div>
                      <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} autoFocus
                        className="w-full px-4 py-4 border-2 border-black text-center text-3xl font-black focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all placeholder:text-gray-200" placeholder="= ?" />
                    </div>
                  ) : <div className="text-gray-300 animate-pulse text-center py-8 font-bold uppercase text-sm">กำลังโหลด...</div>}
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setCurrentStep('info')} className="flex-1 py-4 border-2 border-black font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-xs"><ArrowLeft className="w-5 h-5" /> กลับ</button>
                  <button type="button" disabled={!canGoNext} onClick={() => setCurrentStep('preview')} className="flex-1 py-4 border-2 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs">ถัดไป <ArrowRight className="w-5 h-5" /></button>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="text-center mb-8 font-serif">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">ตรวจสอบ</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 font-sans">ตรวจสอบข้อมูลและยืนยัน</p>
                </div>
                <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center py-4 border-b-2 border-black">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">ชื่อ</span>
                    <span className="font-black text-lg">{customerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-2 border-black">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">บริการ</span>
                    <span className="font-black flex items-center gap-2">
                      {serviceType === ServiceType.GENERAL && <><ClipboardList className="w-4 h-4" /> GENERAL</>}
                      {serviceType === ServiceType.EXPRESS && <><Zap className="w-4 h-4" /> EXPRESS</>}
                      {serviceType === ServiceType.VIP && <><Crown className="w-4 h-4" /> VIP</>}
                    </span>
                  </div>
                  {note && <div className="flex justify-between items-center py-4 border-b-2 border-black"><span className="text-xs font-black uppercase tracking-widest text-gray-400">NOTE</span><span className="font-bold text-sm max-w-[200px] text-right">{note}</span></div>}
                  <div className="flex justify-between items-center py-4"><span className="text-xs font-black uppercase tracking-widest text-gray-400">ยืนยันแล้ว</span><span className="font-black flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> ผ่าน</span></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setCurrentStep('verify')} className="flex-1 py-4 border-2 border-black font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-xs"><ArrowLeft className="w-5 h-5" /> กลับ</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 border-4 border-black bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs shadow-[6px_6px_0_0_rgba(0,0,0,0.15)]">
                    {isSubmitting ? 'กำลังส่ง...' : <><Send className="w-5 h-5" /> ส่งข้อมูล</>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
