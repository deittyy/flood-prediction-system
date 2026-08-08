import type { View } from '../types'

interface Props {
  onLaunch: (v: View) => void
}

const features = [
  { icon: '◉', label: 'Satellite Imagery', desc: 'Sentinel-2 & Landsat-9 processed every 6 hours across 923,768 km²' },
  { icon: '⬡', label: 'IoT Sensor Network', desc: '340 solar sensors deployed — reporting every 15 minutes' },
  { icon: '▲', label: 'ML Flood Prediction', desc: 'LSTM neural network with 40 years of hydrological training data' },
  { icon: '◈', label: 'SMS / USSD Alerts', desc: 'Multilingual alerts via MTN, Airtel, Glo — no smartphone needed' },
  { icon: '◎', label: 'Evacuation Routing', desc: 'Dynamic routes updated every 30 minutes during active events' },
  { icon: '◐', label: 'Community Reporting', desc: 'Citizens submit water-level data via *347# USSD or WhatsApp' },
]

export default function LandingView({ onLaunch }: Props) {
  return (
    <div className="min-h-screen bg-[#030C1A] overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#0EA5E9 1px, transparent 1px), linear-gradient(90deg, #0EA5E9 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#0EA5E9]/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 10 Q5 6 8 8 Q11 10 14 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="8" cy="4" r="2" fill="white"/>
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">EcoLink <span className="text-[#38BDF8]">AI</span></span>
        </div>
        <button
          onClick={() => onLaunch('dashboard')}
          className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 shadow-lg"
        >
          Launch Platform
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 7h8M8 4l3 3-3 3"/>
          </svg>
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0EA5E9]/25 bg-[#0EA5E9]/8 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span className="font-mono text-[11px] text-[#38BDF8] tracking-widest">MONITORING 36 STATES + FCT — LIVE</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-[1.05] mb-6 tracking-tight">
            Predict the flood.
            <br />
            <em className="not-italic text-[#38BDF8]">Save the community.</em>
          </h1>

          <p className="text-[#5A7A9A] text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            EcoLink AI combines satellite imagery, 340 ground sensors, and machine learning to forecast Nigerian floods{' '}
            <strong className="text-[#94A3B8]">72 hours before impact</strong> — delivering life-saving SMS alerts to every phone, smart or not.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-12">
            {[
              { value: '72hrs', label: 'Lead time' },
              { value: '97.2%', label: 'Accuracy' },
              { value: '2.4M+', label: 'Protected' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-semibold text-white">{value}</div>
                <div className="text-[#3A5A7A] text-xs font-mono mt-1 tracking-wide">{label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onLaunch('dashboard')}
            className="inline-flex items-center gap-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-150 shadow-xl hover:shadow-[#0EA5E9]/20 hover:scale-[1.01]"
          >
            Open the Platform
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 9h10M11 5l4 4-4 4"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <p className="font-mono text-[11px] text-[#2A4060] tracking-widest text-center mb-8">SIX INTEGRATED SYSTEMS</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0E2040]/50 rounded-2xl overflow-hidden border border-[#0E2040]">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#040E1C] hover:bg-[#0A1E35] p-7 transition-colors duration-150 group cursor-pointer"
              onClick={() => onLaunch('dashboard')}
            >
              <span className="text-xl text-[#0EA5E9] opacity-60 group-hover:opacity-100 transition-opacity block mb-4">{f.icon}</span>
              <h3 className="text-white font-semibold text-sm mb-2">{f.label}</h3>
              <p className="text-[#3A5A7A] text-sm leading-relaxed group-hover:text-[#5A7A9A] transition-colors">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <div className="relative z-10 border-t border-[#0E2040] px-8 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-[#1A3050]">© 2026 EcoLink AI Ltd. RC 1847291. Nigeria.</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="font-mono text-[11px] text-[#22C55E]">All systems operational</span>
        </div>
        <span className="font-mono text-[11px] text-[#1A3050]">Emergency USSD: *347#</span>
      </div>
    </div>
  )
}
