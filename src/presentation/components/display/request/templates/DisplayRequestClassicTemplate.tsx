'use client';

import { ServiceType } from '@/src/domain/types/queue';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Crown, Eye, Lock, Send, Ticket, User, Zap } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { DisplayRequestTemplateProps, RequestStep } from '../DisplayRequestView';

const STEPS: { key: RequestStep; label: string; icon: React.ReactNode }[] = [
  { key: 'info', label: 'ข้อมูล', icon: <User className="w-4 h-4" /> },
  { key: 'verify', label: 'ยืนยัน', icon: <Lock className="w-4 h-4" /> },
  { key: 'preview', label: 'ตรวจสอบ', icon: <Eye className="w-4 h-4" /> },
];

export function DisplayRequestClassicTemplate({
  currentStep,
  setCurrentStep,
  customerName,
  setCustomerName,
  serviceType,
  setServiceType,
  note,
  setNote,
  appendNote,
  clearNote,
  clearCustomerName,
  challenge,
  challengeAnswer,
  setChallengeAnswer,
  isSubmitting,
  error,
  successCode,
  qrCodeUrl,
  countdown,
  handleDone,
  handleSubmit,
  canGoNext,
  presets,
}: DisplayRequestTemplateProps) {
  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  // ─── Success State ───
  if (successCode) {
    return (
      <div className="fixed inset-0 z-[999] w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white font-sans p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[200px] rounded-full"></div>
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="mx-auto w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3">ส่งคำขอสำเร็จ!</h1>
          <p className="text-slate-400 text-base mb-10">เราได้รับคำขอคิวของคุณเรียบร้อยแล้ว</p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-10">
            {/* Tracking Code */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex-1 w-full">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">รหัสติดตาม</div>
              <div className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-emerald-400 font-mono select-all">
                {successCode}
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-xl shadow-lg shrink-0">
                <QRCodeSVG value={qrCodeUrl} size={110} level="H" includeMargin={false} />
                <div className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mt-2">สแกนเพื่อตรวจสอบ</div>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 mb-8">
            กลับสู่หน้าหลักอัตโนมัติใน {countdown} วินาที
          </p>

          <button
            onClick={handleDone}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all text-lg shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับหน้าจอแสดงคิว
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] w-full h-full flex flex-col bg-slate-900 text-white font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/8 blur-[150px] rounded-full"></div>
      </div>

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-slate-950 border-b border-slate-800 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/display"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">กลับ</span>
          </Link>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg sm:text-xl font-bold">ขอบัตรคิว</h1>
          </div>
        </div>
      </header>

      {/* ─── Step Indicator ─── */}
      <div className="px-4 sm:px-8 py-4 bg-slate-950/50 border-b border-slate-800/50 shrink-0 relative z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              <button
                onClick={() => {
                  if (idx < stepIndex) setCurrentStep(step.key);
                }}
                disabled={idx > stepIndex}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  idx === stepIndex
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : idx < stepIndex
                      ? 'text-emerald-400 cursor-pointer hover:bg-slate-800'
                      : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === stepIndex
                      ? 'bg-blue-500 text-white'
                      : idx < stepIndex
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {idx < stepIndex ? '✓' : idx + 1}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`h-px flex-1 mx-2 ${idx < stepIndex ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Content ─── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto relative z-10">
        <div className="w-full max-w-lg">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ═══ Step 1: Info ═══ */}
            {currentStep === 'info' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black mb-2">กรอกข้อมูล</h2>
                  <p className="text-slate-400">กรุณากรอกข้อมูลเพื่อขอบัตรคิว</p>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    ชื่อลูกค้า <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-base"
                      placeholder="กรอกชื่อของคุณ"
                      autoFocus
                    />
                    {customerName && (
                      <button
                        type="button"
                        onClick={clearCustomerName}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {presets.customerNames.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomerName(preset)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ประเภทบริการ</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: ServiceType.GENERAL, label: 'ทั่วไป', icon: <ClipboardList className="w-5 h-5" /> },
                      { value: ServiceType.EXPRESS, label: 'ด่วน', icon: <Zap className="w-5 h-5" /> },
                      { value: ServiceType.VIP, label: 'VIP', icon: <Crown className="w-5 h-5" /> },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setServiceType(option.value)}
                        className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all ${
                          serviceType === option.value
                            ? 'bg-blue-500/15 border-blue-500/50 text-blue-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        {option.icon}
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    หมายเหตุ <span className="text-slate-600 text-xs font-normal">(ไม่บังคับ)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-base"
                      placeholder="ข้อมูลเพิ่มเติม..."
                    />
                    {note && (
                      <button
                        type="button"
                        onClick={clearNote}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {presets.notes.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => appendNote(preset)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setCurrentStep('verify')}
                  className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/20"
                >
                  ถัดไป
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ═══ Step 2: Verify ═══ */}
            {currentStep === 'verify' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black mb-2">ยืนยันตัวตน</h2>
                  <p className="text-slate-400">แก้โจทย์ด้านล่างเพื่อยืนยัน</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-6 text-slate-400">
                    <Lock className="w-5 h-5" />
                    <span className="text-sm font-medium">ป้องกันบอท</span>
                  </div>

                  {challenge ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="inline-block text-4xl sm:text-5xl font-black text-white bg-slate-700 px-8 py-4 rounded-xl border border-slate-600">
                          {challenge.question}
                        </div>
                      </div>
                      <input
                        type="number"
                        value={challengeAnswer}
                        onChange={(e) => setChallengeAnswer(e.target.value)}
                        className="w-full px-4 py-4 rounded-xl bg-slate-700 border border-slate-600 text-white text-center text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-500"
                        placeholder="= ?"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="text-slate-500 animate-pulse text-center py-8">กำลังโหลดโจทย์...</div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('info')}
                    className="flex-1 py-4 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-base"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setCurrentStep('preview')}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-500/20"
                  >
                    ถัดไป
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ Step 3: Preview ═══ */}
            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black mb-2">ตรวจสอบข้อมูล</h2>
                  <p className="text-slate-400">ตรวจสอบข้อมูลก่อนส่งคำขอ</p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-5">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">ชื่อลูกค้า</span>
                    <span className="font-bold text-white text-lg">{customerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">ประเภทบริการ</span>
                    <span className="font-bold text-white flex items-center gap-2">
                      {serviceType === ServiceType.GENERAL && <><ClipboardList className="w-4 h-4 text-slate-400" /> ทั่วไป</>}
                      {serviceType === ServiceType.EXPRESS && <><Zap className="w-4 h-4 text-orange-400" /> ด่วน</>}
                      {serviceType === ServiceType.VIP && <><Crown className="w-4 h-4 text-purple-400" /> VIP</>}
                    </span>
                  </div>
                  {note && (
                    <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                      <span className="text-sm text-slate-400">หมายเหตุ</span>
                      <span className="font-medium text-slate-300 max-w-[200px] text-right">{note}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-slate-400">ยืนยันตัวตน</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> ผ่านแล้ว
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('verify')}
                    className="flex-1 py-4 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-base"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    ย้อนกลับ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/20"
                  >
                    {isSubmitting ? (
                      'กำลังส่ง...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        ยืนยันส่งคำขอ
                      </>
                    )}
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
