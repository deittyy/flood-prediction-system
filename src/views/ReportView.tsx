import { useState } from 'react'
import { NIGERIA_STATES } from '../data'

type Step = 'form' | 'confirm' | 'success'

const LGAS: Record<string, string[]> = {
  Kogi: ['Lokoja LGA', 'Kogi LGA', 'Adavi LGA', 'Ajaokuta LGA', 'Ankpa LGA'],
  Benue: ['Makurdi LGA', 'Gboko LGA', 'Otukpo LGA', 'Katsina-Ala LGA'],
  Anambra: ['Onitsha North', 'Onitsha South', 'Awka South', 'Nnewi North'],
  Delta: ['Warri South', 'Warri North', 'Uvwie LGA', 'Isoko South'],
  Rivers: ['Port Harcourt LGA', 'Obio-Akpor LGA', 'Eleme LGA'],
  Lagos: ['Lagos Island', 'Lagos Mainland', 'Surulere LGA', 'Eti-Osa LGA'],
  Oyo: ['Ibadan North', 'Ibadan South-West', 'Ogbomosho North'],
  default: ['Select LGA'],
}

export default function ReportView() {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({
    state: '',
    lga: '',
    landmark: '',
    depth: '',
    trend: 'rising' as 'rising' | 'stable' | 'falling',
    notes: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (k: keyof typeof form, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.state) e.state = 'Select your state'
    if (!form.lga) e.lga = 'Select your LGA'
    if (!form.landmark) e.landmark = 'Landmark or location is required'
    if (!form.depth) e.depth = 'Water depth is required'
    else if (isNaN(Number(form.depth)) || Number(form.depth) < 0) e.depth = 'Enter a valid depth in cm'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (validate()) setStep('confirm')
  }

  const confirm = () => setStep('success')
  const reset = () => { setStep('form'); setForm({ state: '', lga: '', landmark: '', depth: '', trend: 'rising', notes: '', phone: '' }) }

  const lgas = LGAS[form.state] ?? LGAS.default

  if (step === 'success') {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-[#040E1C] border border-[#22C55E]/30 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 14l6 6L23 8"/>
            </svg>
          </div>
          <h2 className="text-white font-display text-2xl font-semibold mb-2">Report submitted!</h2>
          <p className="text-[#3A5A7A] text-sm mb-2">Your report for <strong className="text-[#94A3B8]">{form.landmark}, {form.lga}</strong> has been received.</p>
          <p className="text-[#3A5A7A] text-sm mb-8">It will be reviewed and incorporated into the flood prediction model within <strong className="text-[#94A3B8]">3 minutes</strong>.</p>

          <div className="bg-[#071424] border border-[#0E2040] rounded-xl p-5 text-left mb-8 space-y-3">
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-[#2A4060]">REPORT ID</span>
              <span className="font-mono text-xs text-[#38BDF8]">RPT-{Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-[#2A4060]">WATER DEPTH</span>
              <span className="font-mono text-xs text-[#E2EAF4]">{form.depth} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-[#2A4060]">TREND</span>
              <span className={`font-mono text-xs ${form.trend === 'rising' ? 'text-[#EF4444]' : form.trend === 'falling' ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                {form.trend === 'rising' ? '↑ Rising' : form.trend === 'falling' ? '↓ Falling' : '→ Stable'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-[#2A4060]">POINTS EARNED</span>
              <span className="font-mono text-xs text-[#A78BFA]">+35 pts</span>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full bg-[#0EA5E9]/10 hover:bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-[#38BDF8] font-medium py-3 rounded-xl transition-colors"
          >
            Submit another report
          </button>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <button onClick={() => setStep('form')} className="flex items-center gap-2 text-[#3A5A7A] hover:text-[#6A8AAA] text-sm mb-6 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M10 4L6 8l4 4"/>
          </svg>
          Back to edit
        </button>

        <div className="bg-[#040E1C] border border-[#0E2040] rounded-2xl p-6">
          <h2 className="text-white font-display text-xl font-semibold mb-5">Confirm your report</h2>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Location', value: `${form.landmark}, ${form.lga}, ${form.state}` },
              { label: 'Water depth', value: `${form.depth} cm` },
              { label: 'Trend', value: form.trend === 'rising' ? '↑ Rising' : form.trend === 'falling' ? '↓ Falling' : '→ Stable' },
              ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
              ...(form.phone ? [{ label: 'Phone', value: form.phone }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 py-2.5 border-b border-[#071424]">
                <span className="font-mono text-[10px] text-[#2A4060] tracking-widest w-24 flex-none pt-0.5">{label.toUpperCase()}</span>
                <span className="text-sm text-[#94A3B8]">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0EA5E9]/5 border border-[#0EA5E9]/15 rounded-lg p-4 mb-6">
            <p className="text-xs text-[#3A5A7A] leading-relaxed">
              By submitting, you confirm this observation is accurate to the best of your knowledge. False reports can affect emergency response decisions.
            </p>
          </div>

          <button
            onClick={confirm}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Submit Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white font-display text-2xl font-semibold">Report Water Level</h1>
        <p className="text-[#3A5A7A] text-sm mt-1">Your observation improves flood predictions for your entire community.</p>
      </div>

      {/* USSD alternative */}
      <div className="bg-[#071424] border border-[#0E2040] rounded-xl p-4 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center flex-none">
          <span className="font-mono text-[10px] text-[#38BDF8]">#</span>
        </div>
        <p className="text-xs text-[#3A5A7A]">
          No internet? Dial <span className="font-mono text-[#38BDF8]">*347*2#</span> from any phone to submit a report via USSD.
        </p>
      </div>

      <div className="bg-[#040E1C] border border-[#0E2040] rounded-2xl p-6 space-y-5">
        {/* State + LGA */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">STATE *</label>
            <select
              value={form.state}
              onChange={e => { update('state', e.target.value); update('lga', '') }}
              className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-3 py-2.5 text-sm text-[#94A3B8] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
            >
              <option value="">Select state...</option>
              {NIGERIA_STATES.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            {errors.state && <p className="text-[#EF4444] text-[11px] mt-1 font-mono">{errors.state}</p>}
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">LGA *</label>
            <select
              value={form.lga}
              onChange={e => update('lga', e.target.value)}
              disabled={!form.state}
              className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-3 py-2.5 text-sm text-[#94A3B8] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors disabled:opacity-40"
            >
              <option value="">Select LGA...</option>
              {lgas.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.lga && <p className="text-[#EF4444] text-[11px] mt-1 font-mono">{errors.lga}</p>}
          </div>
        </div>

        {/* Landmark */}
        <div>
          <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">LANDMARK / LOCATION *</label>
          <input
            type="text"
            placeholder="e.g. Behind Ganaja Market, near the river bridge..."
            value={form.landmark}
            onChange={e => update('landmark', e.target.value)}
            className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-4 py-2.5 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
          />
          {errors.landmark && <p className="text-[#EF4444] text-[11px] mt-1 font-mono">{errors.landmark}</p>}
        </div>

        {/* Depth + Trend */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">WATER DEPTH (cm) *</label>
            <input
              type="number"
              placeholder="e.g. 85"
              min="0"
              value={form.depth}
              onChange={e => update('depth', e.target.value)}
              className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-4 py-2.5 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
            />
            {errors.depth && <p className="text-[#EF4444] text-[11px] mt-1 font-mono">{errors.depth}</p>}
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">WATER TREND *</label>
            <div className="flex gap-2">
              {(['rising', 'stable', 'falling'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => update('trend', t)}
                  className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    form.trend === t
                      ? t === 'rising' ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
                        : t === 'falling' ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
                        : 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]'
                      : 'bg-[#071424] border-[#0E2040] text-[#3A5A7A] hover:text-[#6A8AAA]'
                  }`}
                >
                  {t === 'rising' ? '↑' : t === 'falling' ? '↓' : '→'} {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">ADDITIONAL NOTES (optional)</label>
          <textarea
            placeholder="Describe what you see — is water entering buildings? Are roads passable? Any unusual smell or colour?"
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
            rows={3}
            className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-4 py-2.5 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors resize-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">PHONE NUMBER (optional — for follow-up alerts)</label>
          <input
            type="tel"
            placeholder="+234 800 000 0000"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-4 py-2.5 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
          />
        </div>

        {/* Points reminder */}
        <div className="flex items-center gap-3 bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-lg px-4 py-3">
          <span className="text-[#A78BFA] text-lg">⭐</span>
          <p className="text-xs text-[#6A5A9A]">
            Verified reports earn <strong className="text-[#A78BFA]">35 points</strong> toward your community leaderboard ranking. Redeem 500 points for free airtime.
          </p>
        </div>

        <button
          onClick={submit}
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold py-3.5 rounded-xl transition-colors duration-150 shadow-lg"
        >
          Review and Submit →
        </button>
      </div>
    </div>
  )
}
