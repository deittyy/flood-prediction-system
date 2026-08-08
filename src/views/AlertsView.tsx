import { useState } from 'react'
import { ALERTS } from '../data'
import type { FloodAlert } from '../types'

type Filter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'resolved'

const levelColor = (level: string) => {
  if (level === 'CRITICAL') return { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', dot: 'bg-[#EF4444]' }
  if (level === 'HIGH') return { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', dot: 'bg-[#F59E0B]' }
  if (level === 'MODERATE') return { text: 'text-[#38BDF8]', bg: 'bg-[#0EA5E9]/10', border: 'border-[#0EA5E9]/30', dot: 'bg-[#38BDF8]' }
  return { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/30', dot: 'bg-[#22C55E]' }
}

function AlertCard({ alert, expanded, onToggle }: { alert: FloodAlert; expanded: boolean; onToggle: () => void }) {
  const c = levelColor(alert.level)
  const time = new Date(alert.timestamp)
  const hoursAgo = Math.round((Date.now() - time.getTime()) / 3600000)

  return (
    <div className={`bg-[#040E1C] border rounded-xl overflow-hidden transition-all duration-200 ${expanded ? `border-[${c.border}]` : 'border-[#0E2040] hover:border-[#152840]'}`}>
      <button
        className="w-full text-left p-5 flex items-start gap-4"
        onClick={onToggle}
      >
        {/* Level indicator */}
        <div className={`flex-none mt-0.5 w-2.5 h-2.5 rounded-full ${c.dot} ${alert.status === 'active' ? 'animate-pulse' : 'opacity-50'}`} />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`font-mono text-[10px] px-2 py-0.5 rounded border tracking-widest ${c.text} ${c.bg} ${c.border}`}>
              {alert.level}
            </span>
            {alert.status === 'resolved' && (
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30 tracking-widest">RESOLVED</span>
            )}
            <span className="text-[#2A4060] font-mono text-[10px]">{alert.id}</span>
            <span className="text-[#1A3050] font-mono text-[10px] ml-auto">
              {hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`}
            </span>
          </div>
          <div className="text-[#94A3B8] text-sm font-semibold mb-1">{alert.state} — {alert.lga}</div>
          <p className="text-[#3A5A7A] text-xs leading-relaxed line-clamp-2">{alert.message}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-mono text-[10px] text-[#2A4060]">{alert.smsSent.toLocaleString()} SMS sent</span>
            <span className="font-mono text-[10px] text-[#2A4060]">{(alert.affectedPop / 1000).toFixed(0)}k affected</span>
            <span className={`font-mono text-[10px] ${c.text}`}>Water: {alert.waterLevel} cm</span>
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2A4060" strokeWidth="1.8" strokeLinecap="round"
          className={`flex-none mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-[#0E2040] px-5 py-5 space-y-5">
          {/* Water level bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#2A4060] tracking-widest">WATER LEVEL PROGRESSION</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#3A5A7A] w-8">Now</span>
              <div className="flex-1 h-2 bg-[#0E2040] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.dot}`} style={{ width: `${Math.min(100, (alert.waterLevel / 400) * 100)}%` }} />
              </div>
              <span className={`font-mono text-xs ${c.text}`}>{alert.waterLevel} cm</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="font-mono text-[10px] text-[#3A5A7A] w-8">+72h</span>
              <div className="flex-1 h-2 bg-[#0E2040] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#EF4444]" style={{ width: `${Math.min(100, (alert.forecast72h / 400) * 100)}%` }} />
              </div>
              <span className="font-mono text-xs text-[#EF4444]">{alert.forecast72h} cm</span>
            </div>
          </div>

          {/* Evacuation routes */}
          <div>
            <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">EVACUATION ROUTES</p>
            <div className="space-y-2">
              {alert.evacuationRoutes.map((route, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#071424] border border-[#0E2040] rounded-lg px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 6h8M7 3l3 3-3 3"/>
                  </svg>
                  <span className="text-xs text-[#6A8AAA]">{route}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest shelter */}
          <div className="flex items-center gap-3 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-lg p-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 2L2 7v7h4v-4h4v4h4V7L8 2z"/>
            </svg>
            <span className="text-xs text-[#5A9A7A]">{alert.nearestShelter}</span>
          </div>

          {/* SMS detail */}
          <div className="bg-[#071424] border border-[#0E2040] rounded-lg p-4">
            <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-3">ALERT MESSAGE SENT</p>
            <div className="font-mono text-[11px] text-[#5A7A9A] leading-relaxed">
              <span className="text-[#38BDF8]">FLOOD ALERT - {alert.state.toUpperCase()}</span><br />
              Your area ({alert.lga}) faces {alert.level.toLowerCase()} flood risk.<br />
              Water level: {alert.waterLevel} cm | 72h forecast: {alert.forecast72h} cm<br /><br />
              {alert.evacuationRoutes[0]}<br /><br />
              Nearest shelter: {alert.nearestShelter}<br />
              Updates: *347*1# | Report: *347*2#
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AlertsView() {
  const [filter, setFilter] = useState<Filter>('ALL')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(ALERTS[0]?.id ?? null)

  const filtered = ALERTS.filter(a => {
    if (filter === 'resolved') return a.status === 'resolved'
    if (filter !== 'ALL') return a.level === filter && a.status === 'active'
    return true
  }).filter(a => {
    if (!search) return true
    const q = search.toLowerCase()
    return a.state.toLowerCase().includes(q) || a.lga.toLowerCase().includes(q) || a.message.toLowerCase().includes(q)
  })

  const counts = {
    ALL: ALERTS.length,
    CRITICAL: ALERTS.filter(a => a.level === 'CRITICAL' && a.status === 'active').length,
    HIGH: ALERTS.filter(a => a.level === 'HIGH' && a.status === 'active').length,
    MODERATE: ALERTS.filter(a => a.level === 'MODERATE' && a.status === 'active').length,
    resolved: ALERTS.filter(a => a.status === 'resolved').length,
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-display text-2xl font-semibold">Alert Centre</h1>
          <p className="text-[#3A5A7A] text-sm mt-1 font-mono">
            <span className="text-[#EF4444]">{counts.CRITICAL} critical</span>
            {' · '}
            <span className="text-[#F59E0B]">{counts.HIGH} high</span>
            {' · '}
            <span className="text-[#38BDF8]">{counts.MODERATE} moderate</span>
          </p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'resolved'] as Filter[]).map(f => {
            const c = f === 'CRITICAL' ? 'text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/5'
              : f === 'HIGH' ? 'text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/5'
              : f === 'MODERATE' ? 'text-[#38BDF8] border-[#0EA5E9]/40 bg-[#0EA5E9]/5'
              : f === 'resolved' ? 'text-[#22C55E] border-[#22C55E]/40 bg-[#22C55E]/5'
              : 'text-[#94A3B8] border-[#0E2040]'
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[10px] px-3 py-1.5 rounded-lg border tracking-wider transition-all ${
                  filter === f ? c : 'text-[#3A5A7A] border-[#0E2040] hover:text-[#6A8AAA]'
                }`}
              >
                {f.toUpperCase()} {counts[f] > 0 && `(${counts[f]})`}
              </button>
            )
          })}
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A4060]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="6" cy="6" r="4"/><path d="M10 10l2.5 2.5"/>
            </svg>
            <input
              type="text"
              placeholder="Search state, LGA, or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#040E1C] border border-[#0E2040] rounded-lg pl-9 pr-4 py-2 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#2A4060]">
            <p className="text-base font-medium mb-1">No alerts match your filters</p>
            <p className="text-sm">Try adjusting the filter or search query</p>
          </div>
        ) : (
          filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              expanded={expandedId === alert.id}
              onToggle={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
