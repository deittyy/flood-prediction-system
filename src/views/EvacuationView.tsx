import { useState } from 'react'
import { SHELTERS, EVACUATION_ROUTES, NIGERIA_STATES } from '../data'

const STATES_WITH_DATA = ['Kogi', 'Benue', 'Anambra', 'Delta', 'Bayelsa', 'Rivers']

const routeStatusStyle = (status: string) => {
  if (status === 'clear') return { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/30', label: '✓ Clear' }
  if (status === 'partial') return { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', label: '⚠ Partial' }
  return { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', label: '✕ Blocked' }
}

const shelterStatusStyle = (status: string) => {
  if (status === 'open') return { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/30' }
  if (status === 'standby') return { text: 'text-[#38BDF8]', bg: 'bg-[#0EA5E9]/10', border: 'border-[#0EA5E9]/30' }
  return { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30' }
}

export default function EvacuationView() {
  const [selectedState, setSelectedState] = useState('Kogi')
  const [activeTab, setActiveTab] = useState<'routes' | 'shelters'>('routes')

  const stateRoutes = EVACUATION_ROUTES.filter(r => r.state === selectedState)
  const stateShelters = SHELTERS.filter(s => s.state === selectedState)
  const stateData = NIGERIA_STATES.find(s => s.name === selectedState)

  const totalCapacity = stateShelters.reduce((s, sh) => s + sh.capacity, 0)
  const totalOccupied = stateShelters.reduce((s, sh) => s + sh.occupied, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white font-display text-2xl font-semibold">Evacuation Planner</h1>
        <p className="text-[#3A5A7A] text-sm mt-1">Verified routes and shelter capacity for active flood zones</p>
      </div>

      {/* State selector */}
      <div className="bg-[#040E1C] border border-[#0E2040] rounded-xl p-5">
        <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-3">SELECT STATE</p>
        <div className="flex flex-wrap gap-2">
          {STATES_WITH_DATA.map(s => {
            const risk = NIGERIA_STATES.find(n => n.name === s)?.risk ?? 0
            const riskColors = ['', 'border-[#22C55E]/30 text-[#22C55E]', 'border-[#38BDF8]/30 text-[#38BDF8]', 'border-[#F59E0B]/30 text-[#F59E0B]', 'border-[#EF4444]/30 text-[#EF4444]']
            return (
              <button
                key={s}
                onClick={() => setSelectedState(s)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedState === s
                    ? `bg-[#0EA5E9]/10 border-[#0EA5E9]/40 text-[#38BDF8]`
                    : `bg-[#071424] ${riskColors[risk]} hover:bg-[#0A1E35]`
                }`}
              >
                {s}
                {risk >= 3 && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* State overview */}
      {stateData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Risk Level', value: ['None', 'Low', 'Elevated', 'High', 'Critical'][stateData.risk], color: ['text-[#3A5A7A]', 'text-[#22C55E]', 'text-[#38BDF8]', 'text-[#F59E0B]', 'text-[#EF4444]'][stateData.risk] },
            { label: 'Water Level', value: `${stateData.waterLevelCm} cm`, color: stateData.waterLevelCm > 200 ? 'text-[#EF4444]' : 'text-[#E2EAF4]' },
            { label: 'Shelter Spaces', value: `${(totalCapacity - totalOccupied).toLocaleString()} free`, color: 'text-[#22C55E]' },
            { label: 'Routes Active', value: `${stateRoutes.filter(r => r.status === 'clear').length}/${stateRoutes.length} clear`, color: 'text-[#38BDF8]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#040E1C] border border-[#0E2040] rounded-lg p-4">
              <p className="font-mono text-[9px] text-[#2A4060] tracking-widest mb-1">{label.toUpperCase()}</p>
              <p className={`font-mono text-sm font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(['routes', 'shelters'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[11px] tracking-wider px-4 py-2 rounded-lg border transition-all capitalize ${
              activeTab === tab
                ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/8 text-[#38BDF8]'
                : 'border-[#0E2040] text-[#3A5A7A] hover:text-[#6A8AAA]'
            }`}
          >
            {tab === 'routes' ? `Evacuation Routes (${stateRoutes.length})` : `Shelters (${stateShelters.length})`}
          </button>
        ))}
      </div>

      {/* Routes */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          {stateRoutes.length === 0 ? (
            <div className="text-center py-16 text-[#2A4060]">
              <p>No evacuation routes defined for {selectedState} yet.</p>
            </div>
          ) : (
            stateRoutes.map(route => {
              const c = routeStatusStyle(route.status)
              return (
                <div key={route.id} className="bg-[#040E1C] border border-[#0E2040] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border tracking-wide ${c.text} ${c.bg} ${c.border}`}>
                          {c.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#2A4060]">{route.id}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm">{route.fromZone}</h3>
                    </div>
                    <div className="text-right flex-none">
                      <div className="font-mono text-sm font-semibold text-[#E2EAF4]">{route.distanceKm} km</div>
                      <div className="font-mono text-[10px] text-[#3A5A7A]">~{route.estimatedMins} min</div>
                    </div>
                  </div>

                  {/* Route path */}
                  <div className="flex items-center gap-0 overflow-x-auto pb-1 mb-4">
                    {route.landmarks.map((lm, i) => (
                      <div key={i} className="flex items-center gap-0 flex-none">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-2.5 h-2.5 rounded-full border-2 ${i === 0 ? 'bg-[#0EA5E9] border-[#0EA5E9]' : i === route.landmarks.length - 1 ? 'bg-[#22C55E] border-[#22C55E]' : 'bg-transparent border-[#0E2040]'}`} />
                          <span className="text-[9px] font-mono text-[#3A5A7A] max-w-[60px] text-center leading-tight">{lm}</span>
                        </div>
                        {i < route.landmarks.length - 1 && (
                          <div className={`w-8 h-px mb-4 ${route.status === 'blocked' ? 'bg-[#EF4444]/40' : 'bg-[#0E2040]'}`} />
                        )}
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-1 flex-none ml-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#22C55E]" />
                      <span className="text-[9px] font-mono text-[#22C55E] max-w-[60px] text-center leading-tight">{route.toShelter}</span>
                    </div>
                  </div>

                  {/* Destination shelter snippet */}
                  <div className="flex items-center gap-3 bg-[#071424] border border-[#0E2040] rounded-lg px-4 py-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round">
                      <path d="M7 1L1 6v7h4V9h4v4h4V6L7 1z"/>
                    </svg>
                    <span className="text-xs text-[#5A7A9A]">
                      Destination: <strong className="text-[#94A3B8]">{route.toShelter}</strong>
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Shelters */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          {stateShelters.length === 0 ? (
            <div className="text-center py-16 text-[#2A4060]">
              <p>No shelter data for {selectedState} yet.</p>
            </div>
          ) : (
            stateShelters.map(shelter => {
              const c = shelterStatusStyle(shelter.status)
              const occupancyPct = (shelter.occupied / shelter.capacity) * 100
              return (
                <div key={shelter.id} className="bg-[#040E1C] border border-[#0E2040] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border tracking-wide capitalize ${c.text} ${c.bg} ${c.border}`}>
                          {shelter.status}
                        </span>
                        <span className="font-mono text-[10px] text-[#2A4060]">{shelter.id}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-0.5">{shelter.name}</h3>
                      <p className="text-[#3A5A7A] text-xs">{shelter.address}</p>
                    </div>
                    <div className="text-right flex-none">
                      <div className="font-mono text-sm font-semibold text-[#E2EAF4]">{(shelter.capacity - shelter.occupied).toLocaleString()}</div>
                      <div className="font-mono text-[10px] text-[#3A5A7A]">spaces free</div>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-[#2A4060]">OCCUPANCY</span>
                      <span className="font-mono text-[10px] text-[#3A5A7A]">{shelter.occupied.toLocaleString()} / {shelter.capacity.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-[#0E2040] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${occupancyPct >= 95 ? 'bg-[#EF4444]' : occupancyPct >= 75 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Amenities + contact */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex flex-wrap gap-1.5">
                      {shelter.amenities.map(a => (
                        <span key={a} className="font-mono text-[9px] text-[#3A5A7A] bg-[#071424] border border-[#0E2040] px-2 py-0.5 rounded">
                          {a}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`tel:${shelter.contact}`}
                      className="flex items-center gap-1.5 font-mono text-[11px] text-[#38BDF8] hover:text-[#7DD3FC] transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 2a1 1 0 011-1h2.5l1 3L5 5.5a7.5 7.5 0 004.5 4.5L11 8.5l3 1V12a1 1 0 01-1 1C5.4 13 -1 6.6-1 2A1 1 0 010 1"/>
                      </svg>
                      {shelter.contact}
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* USSD tip */}
      <div className="bg-[#071424] border border-[#0E2040] rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center flex-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="6"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="#38BDF8"/>
          </svg>
        </div>
        <div>
          <p className="text-[#94A3B8] text-sm font-medium mb-1">Find nearest shelter via any phone</p>
          <p className="text-[#3A5A7A] text-xs leading-relaxed">
            Dial <span className="font-mono text-[#38BDF8]">*347*3#</span> and follow the prompts. The system detects your location and returns the 3 nearest open shelters with distances and contact numbers — no internet required.
          </p>
        </div>
      </div>
    </div>
  )
}
