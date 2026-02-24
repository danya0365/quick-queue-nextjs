'use client';

import { ServiceType } from '@/src/domain/types/queue';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Crown, Lock, Send, Ticket, Zap } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { DisplayRequestTemplateProps, RequestStep } from '../DisplayRequestView';

const STEPS: { key: RequestStep; label: string }[] = [
  { key: 'info', label: 'INPUT_' },
  { key: 'verify', label: 'AUTH_' },
  { key: 'preview', label: 'CONFIRM_' },
];

export function DisplayRequestRetroTechMagazineTemplate({
  currentStep, setCurrentStep, customerName, setCustomerName, serviceType, setServiceType,
  note, setNote, challenge, challengeAnswer, setChallengeAnswer, isSubmitting, error,
  successCode, qrCodeUrl, countdown, handleDone, handleSubmit, canGoNext, presets,
}: DisplayRequestTemplateProps) {
  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  if (successCode) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 font-mono"
        style={{ backgroundColor: '#0a0a0a', backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />
        <div className="relative z-30 w-full max-w-md text-center">
          <div className="w-20 h-20 border-[4px] border-[#39FF14] bg-black mx-auto flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(57,255,20,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-[#39FF14]" />
          </div>
          <h1 className="text-4xl font-black text-[#39FF14] tracking-widest uppercase mb-3 drop-shadow-[0_0_10px_#39FF14]">SUCCESS_</h1>
          <p className="text-[#00FFFF] font-bold uppercase text-xs tracking-widest mb-10">REQUEST.SUBMITTED.OK</p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-10">
            {/* Tracking Code */}
            <div className="border-[4px] border-[#FF00FF] bg-black p-6 shadow-[8px_8px_0_0_rgba(255,0,255,0.5)] flex-1 w-full">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00FFFF] mb-4">TRACK.CODE =</div>
              <div className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-[#39FF14] select-all drop-shadow-[0_0_15px_#39FF14]">{successCode}</div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="border-[4px] border-[#00FFFF] bg-white p-4 shadow-[8px_8px_0_0_rgba(0,255,255,0.5)] shrink-0">
                <QRCodeSVG value={qrCodeUrl} size={110} level="H" includeMargin={false} />
                <div className="text-[10px] font-black text-black uppercase tracking-widest mt-2">SCAN.ME_</div>
              </div>
            )}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-[#FF00FF] mb-10">
            AUTO.RETURN IN {countdown}S_
          </p>

          <button onClick={handleDone} className="inline-flex items-center gap-2 px-8 py-4 border-[4px] border-[#00FFFF] bg-black text-[#00FFFF] font-black uppercase tracking-widest hover:bg-[#00FFFF] hover:text-black transition-colors text-sm shadow-[4px_4px_0_0_rgba(0,255,255,0.5)]">
            <ArrowLeft className="w-5 h-5" /> BACK.TO.DISPLAY_
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col font-mono"
      style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>

      <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-[#00FFFF] border-b-[4px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/display" className="flex items-center gap-1.5 p-2 border-[3px] border-black bg-white hover:bg-[#FF00FF] hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
            <ArrowLeft className="w-5 h-5" strokeWidth={3} /><span className="hidden sm:inline text-xs font-black uppercase tracking-widest">BACK_</span>
          </Link>
          <Ticket className="w-5 h-5 text-[#FF00FF]" strokeWidth={3} />
          <h1 className="text-lg font-black uppercase tracking-widest" style={{ WebkitTextStroke: '0.5px black' }}>GET.TICKET_</h1>
        </div>
      </header>

      <div className="px-4 sm:px-8 py-3 bg-[#FF00FF] border-b-[3px] border-black shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              <button onClick={() => { if (idx < stepIndex) setCurrentStep(step.key); }} disabled={idx > stepIndex}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-[3px] border-black ${
                  idx === stepIndex ? 'bg-black text-[#00FFFF] shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : idx < stepIndex ? 'bg-[#39FF14] text-black cursor-pointer' : 'bg-white/30 text-white/50 cursor-not-allowed'
                }`}>{idx + 1}_{step.label}</button>
              {idx < STEPS.length - 1 && <div className={`h-1 flex-1 mx-1 border-y-[2px] border-black ${idx < stepIndex ? 'bg-[#39FF14]' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
        <div className="w-full max-w-lg relative z-10">
          {error && <div className="mb-6 border-[3px] border-black bg-[#FF00FF] p-4 text-sm text-white font-black uppercase tracking-wider shadow-[4px_4px_0_0_rgba(0,0,0,1)]">[ERR] {error}</div>}
          <form onSubmit={handleSubmit}>
            {currentStep === 'info' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black tracking-widest uppercase text-[#FF00FF]" style={{ WebkitTextStroke: '1px black' }}>INPUT.DATA_</h2>
                  <p className="text-xs font-black uppercase tracking-widest mt-2 text-gray-500">// ENTER YOUR INFO BELOW</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#FF00FF]">$NAME <span className="text-red-500">*</span></label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} autoFocus
                    className="w-full px-4 py-3.5 border-[3px] border-black bg-white placeholder:text-gray-300 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(255,0,255,1)] transition-all text-base font-black" placeholder="กรอกชื่อของคุณ" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {presets.customerNames.map((p) => <button key={p} type="button" onClick={() => setCustomerName(p)} className="px-3 py-1.5 text-[10px] border-2 border-black text-gray-500 hover:bg-[#00FFFF] hover:text-black transition-all font-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">+ {p}</button>)}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#FF00FF]">$TYPE</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ value: ServiceType.GENERAL, label: 'GENERAL', icon: <ClipboardList className="w-5 h-5" strokeWidth={3} /> }, { value: ServiceType.EXPRESS, label: 'EXPRESS', icon: <Zap className="w-5 h-5" strokeWidth={3} /> }, { value: ServiceType.VIP, label: 'VIP', icon: <Crown className="w-5 h-5" strokeWidth={3} /> }].map((o) => (
                      <button key={o.value} type="button" onClick={() => setServiceType(o.value)}
                        className={`flex flex-col items-center gap-2 py-4 px-3 border-[3px] border-black transition-all font-black text-[10px] uppercase tracking-widest ${
                          serviceType === o.value ? 'bg-[#00FFFF] text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-white text-gray-400 hover:bg-[#FF00FF] hover:text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
                        } active:shadow-none active:translate-x-0.5 active:translate-y-0.5`}>
                        {o.icon}<span>{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#FF00FF]">$NOTE <span className="text-gray-300">(OPT)</span></label>
                  <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3.5 border-[3px] border-black bg-white placeholder:text-gray-300 focus:outline-none focus:shadow-[4px_4px_0_0_rgba(255,0,255,1)] transition-all text-base font-black" placeholder="ข้อมูลเพิ่มเติม..." />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {presets.notes.map((p) => <button key={p} type="button" onClick={() => setNote((prev) => (prev ? prev + ' ' + p : p))} className="px-3 py-1.5 text-[10px] border-2 border-black text-gray-500 hover:bg-[#00FFFF] hover:text-black transition-all font-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">+ {p}</button>)}
                  </div>
                </div>
                <button type="button" disabled={!canGoNext} onClick={() => setCurrentStep('verify')}
                  className="w-full mt-4 py-4 border-[4px] border-black bg-[#39FF14] text-black font-black uppercase tracking-widest hover:bg-[#00FFFF] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                  NEXT_ <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>
            )}

            {currentStep === 'verify' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black tracking-widest uppercase text-[#00FFFF]" style={{ WebkitTextStroke: '1px black' }}>AUTH.CHECK_</h2>
                  <p className="text-xs font-black uppercase tracking-widest mt-2 text-gray-500">// SOLVE TO VERIFY</p>
                </div>
                <div className="border-[4px] border-[#00FFFF] bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,255,255,0.5)]">
                  <div className="flex items-center gap-2 mb-6 text-[#FF00FF] text-[10px] font-black uppercase tracking-widest"><Lock className="w-4 h-4" strokeWidth={3} /> ANTI.BOT_</div>
                  {challenge ? (
                    <div className="space-y-4">
                      <div className="text-center"><div className="inline-block text-4xl font-black bg-black text-[#39FF14] px-8 py-4 border-[3px] border-[#39FF14] shadow-[4px_4px_0_0_rgba(57,255,20,0.5)]">{challenge.question}</div></div>
                      <input type="number" value={challengeAnswer} onChange={(e) => setChallengeAnswer(e.target.value)} autoFocus
                        className="w-full px-4 py-4 border-[3px] border-black text-center text-3xl font-black focus:outline-none focus:shadow-[4px_4px_0_0_rgba(0,255,255,1)] transition-all placeholder:text-gray-200 bg-white" placeholder="= ?" />
                    </div>
                  ) : <div className="text-[#FF00FF] animate-pulse text-center py-8 font-black uppercase text-sm">LOADING.CHALLENGE_</div>}
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setCurrentStep('info')} className="flex-1 py-4 border-[3px] border-black bg-white font-black uppercase tracking-widest hover:bg-[#FF00FF] hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"><ArrowLeft className="w-5 h-5" strokeWidth={3} /> BACK_</button>
                  <button type="button" disabled={!canGoNext} onClick={() => setCurrentStep('preview')} className="flex-1 py-4 border-[3px] border-black bg-[#39FF14] text-black font-black uppercase tracking-widest hover:bg-[#00FFFF] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[10px] shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">NEXT_ <ArrowRight className="w-5 h-5" strokeWidth={3} /></button>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black tracking-widest uppercase text-[#FF00FF]" style={{ WebkitTextStroke: '1px black' }}>CONFIRM_</h2>
                  <p className="text-xs font-black uppercase tracking-widest mt-2 text-gray-500">// REVIEW AND SUBMIT</p>
                </div>
                <div className="border-[4px] border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center py-4 border-b-[3px] border-black">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF]">$NAME</span>
                    <span className="font-black text-lg">{customerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-[3px] border-black">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF]">$TYPE</span>
                    <span className="font-black flex items-center gap-2">
                      {serviceType === ServiceType.GENERAL && <><ClipboardList className="w-4 h-4" /> GENERAL</>}
                      {serviceType === ServiceType.EXPRESS && <><Zap className="w-4 h-4" /> EXPRESS</>}
                      {serviceType === ServiceType.VIP && <><Crown className="w-4 h-4" /> VIP</>}
                    </span>
                  </div>
                  {note && <div className="flex justify-between items-center py-4 border-b-[3px] border-black"><span className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF]">$NOTE</span><span className="font-bold text-sm max-w-[200px] text-right">{note}</span></div>}
                  <div className="flex justify-between items-center py-4"><span className="text-[10px] font-black uppercase tracking-widest text-[#FF00FF]">$AUTH</span><span className="font-black flex items-center gap-1 text-[#39FF14]"><CheckCircle2 className="w-4 h-4" /> PASS_</span></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setCurrentStep('verify')} className="flex-1 py-4 border-[3px] border-black bg-white font-black uppercase tracking-widest hover:bg-[#FF00FF] hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"><ArrowLeft className="w-5 h-5" strokeWidth={3} /> BACK_</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 border-[4px] border-black bg-[#FF00FF] text-white font-black uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[10px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
                    {isSubmitting ? 'SENDING_' : <><Send className="w-5 h-5" strokeWidth={3} /> SUBMIT_</>}
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
