import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { NIGERIA_STATES, ALERTS, SENSORS, COMMUNITY_REPORTS } from '../data'
import type { View } from '../types'

const RISK_GRID: { x: number; y: number; stateId: string }[] = [
  { x: 4, y: 0, stateId: 'sokoto' }, { x: 5, y: 0, stateId: 'katsina' }, { x: 6, y: 0, stateId: 'kano' }, { x: 7, y: 0, stateId: 'jigawa' }, { x: 8, y: 0, stateId: 'borno' },
  { x: 3, y: 1, stateId: 'zamfara' }, { x: 4, y: 1, stateId: 'katsina' }, { x: 5, y: 1, stateId: 'kano' }, { x: 6, y: 1, stateId: 'bauchi' }, { x: 7, y: 1, stateId: 'yobe' }, { x: 8, y: 1, stateId: 'borno' }, { x: 9, y: 1, stateId: 'adamawa' },
  { x: 2, y: 2, stateId: 'kebbi' }, { x: 3, y: 2, stateId: 'zamfara' }, { x: 4, y: 2, stateId: 'kaduna' }, { x: 5, y: 2, stateId: 'bauchi' }, { x: 6, y: 2, stateId: 'gombe' }, { x: 7, y: 2, stateId: 'yobe' }, { x: 8, y: 2, stateId: 'adamawa' }, { x: 9, y: 2, stateId: 'taraba' },
  { x: 2, y: 3, stateId: 'kebbi' }, { x: 3, y: 3, stateId: 'niger' }, { x: 4, y: 3, stateId: 'kaduna' }, { x: 5, y: 3, stateId: 'plateau' }, { x: 6, y: 3, stateId: 'nasarawa' }, { x: 7, y: 3, stateId: 'taraba' }, { x: 8, y: 3, stateId: 'taraba' },
  { x: 2, y: 4, stateId: 'niger' }, { x: 3, y: 4, stateId: 'kogi' }, { x: 4, y: 4, stateId: 'kogi' }, { x: 5, y: 4, stateId: 'benue' }, { x: 6, y: 4, stateId: 'benue' }, { x: 7, y: 4, stateId: 'taraba' },
  { x: 1, y: 5, stateId: 'oyo' }, { x: 2, y: 5, stateId: 'kwara' }, { x: 3, y: 5, stateId: 'kogi' }, { x: 4, y: 5, stateId: 'anambra' }, { x: 5, y: 5, stateId: 'enugu' }, { x: 6, y: 5, stateId: 'ebonyi' }, { x: 7, y: 5, stateId: 'cross-river' },
  { x: 1, y: 6, stateId: 'ogun' }, { x: 2, y: 6, stateId: 'oyo' }, { x: 3, y: 6, stateId: 'ekiti' }, { x: 4, y: 6, stateId: 'ondo' }, { x: 5, y: 6, stateId: 'delta' }, { x: 6, y: 6, stateId: 'imo' }, { x: 7, y: 6, stateId: 'abia' }, { x: 8, y: 6, stateId: 'cross-river' }, { x: 9, y: 6, stateId: 'akwa-ibom' },
  { x: 0, y: 7, stateId: 'lagos' }, { x: 1, y: 7, stateId: 'ogun' }, { x: 2, y: 7, stateId: 'osun' }, { x: 3, y: 7, stateId: 'ekiti' }, { x: 4, y: 7, stateId: 'edo' }, { x: 5, y: 7, stateId: 'delta' }, { x: 6, y: 7, stateId: 'rivers' }, { x: 7, y: 7, stateId: 'akwa-ibom' },
  { x: 4, y: 8, stateId: 'edo' }, { x: 5, y: 8, stateId: 'bayelsa' }, { x: 6, y: 8, stateId: 'rivers' }, { x: 7, y: 8, stateId: 'bayelsa' },
]

const riskStyle = (risk: number): string => {
  if (risk === 4) return 'bg-[#7F1D1D] border-[#EF4444]/60'
  if (risk === 3) return 'bg-[#78350F] border-[#F59E0B]/50'
  if (risk === 2) return 'bg-[#0C4A6E] border-[#0EA5E9]/40'
  if (risk === 1) return 'bg-[#052E16] border-[#22C55E]/30'
  return 'bg-[#0A1628] border-[#0E2040]/80'
}

interface Props { onNavigate: (v: View) => void }

export default function DashboardView({ onNavigate }: Props) {
  const [liveTime, setLiveTime] = useState(new Date())
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const stateMap = Object.fromEntries(NIGERIA_STATES.map(s => [s.id, s]))
  const activeAlerts = ALERTS.filter(a => a.status === 'active')
  const criticalCount = activeAlerts.filter(a => a.level === 'CRITICAL').length

  const riskData = [
    { name: 'Critical', value: NIGERIA_STATES.filter(s => s.risk === 4).length },
    { name: 'High', value: NIGERIA_STATES.filter(s => s.risk === 3).length },
    { name: 'Elevated', value: NIGERIA_STATES.filter(s => s.risk === 2).length },
    { name: 'Low', value: NIGERIA_STATES.filter(s => s.risk === 1).length },
    { name: 'No risk', value: NIGERIA_STATES.filter(s => s.risk === 0).length },
  ]
  const COLORS = ['#EF4444', '#F59E0B', '#38BDF8', '#22C55E', '#3A5A7A']
  const totalSmsToday = ALERTS.reduce((sum, a) => sum + a.smsSent, 0)
  const sensorsOnline = SENSORS.filter(s => s.status === 'online').length

  const hoveredData = hoveredState ? stateMap[hoveredState] : null

  return (
    <div className="p-6 space-y-6 min-h-full">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-display text-2xl font-semibold">Good morning, Abubakar</h1>
          <p className="text-[#3A5A7A] text-sm mt-1 font-mono">
            {liveTime.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}
            <span className="text-[#EF4444]">{criticalCount} critical zones active</span>
          </p>
        </div>
        <button
          onClick={() => onNavigate('alerts')}
          className="flex-none flex items-center gap-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
          View All Alerts
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: activeAlerts.length, sub: `${criticalCount} critical`, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/5', border: 'border-[#EF4444]/20', onClick: () => onNavigate('alerts') },
          { label: 'SMS Sent Today', value: totalSmsToday.toLocaleString(), sub: 'across all networks', color: 'text-[#38BDF8]', bg: 'bg-[#0EA5E9]/5', border: 'border-[#0EA5E9]/20', onClick: () => onNavigate('alerts') },
          { label: 'Sensors Online', value: `${sensorsOnline}/${SENSORS.length}`, sub: `${SENSORS.filter(s => s.status === 'offline').length} offline`, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/5', border: 'border-[#22C55E]/20', onClick: () => onNavigate('map') },
          { label: 'Community Reports', value: COMMUNITY_REPORTS.length.toString(), sub: 'last 6 hours', color: 'text-[#A78BFA]', bg: 'bg-[#7C3AED]/5', border: 'border-[#7C3AED]/20', onClick: () => onNavigate('community') },
        ].map(({ label, value, sub, color, bg, border, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`${bg} border ${border} rounded-xl p-5 h-24 animate-pulse text-left hover:brightness-110 transition-all duration-150 group`}
          >
            <div className={`font-display text-3xl font-semibold ${color} mb-1`}>{value}</div>
            <div className="text-[#94A3B8] text-sm font-medium">{label}</div>
            <div className="text-[#3A5A7A] text-xs font-mono mt-1">{sub}</div>
          </button>
        ))}
      </div>

      {/* Risk distribution */}
      <div className="bg-[#040E1C] border border-[#0E2040] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">Risk Distribution</h2>
            <p className="text-[#3A5A7A] text-xs mt-1">State risk breakdown across Nigeria</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={riskData} innerRadius={30} outerRadius={55} paddingAngle={2} dataKey="value">
              {riskData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-[#94A3B8]">
          {riskData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span>{entry.name}</span>
              <span className="ml-auto font-mono text-xs text-[#E2EAF4]">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Risk map */}
        <div className="lg:col-span-2 bg-[#040E1C] border border-[#0E2040] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-base">Nigeria Flood Risk Map</h2>
              <p className="font-mono text-[11px] text-[#2A4060] mt-0.5 tracking-wide">Real-time · Updated every 15 minutes</p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="text-[#38BDF8] text-xs font-mono hover:text-[#7DD3FC] transition-colors"
            >
              Full map →
            </button>
          </div>

          <div className="relative">
            {/* Grid */}
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(11, 1fr)', maxWidth: '100%' }}>
              {Array.from({ length: 9 }, (_, row) =>
                Array.from({ length: 11 }, (_, col) => {
                  const cell = RISK_GRID.find(c => c.x === col && c.y === row)
                  if (!cell) return <div key={`${col}-${row}`} style={{ aspectRatio: '1' }} />
                  const state = stateMap[cell.stateId]
                  const isHovered = hoveredState === cell.stateId
                  return (
                    <div
                      key={`${col}-${row}`}
                      style={{ aspectRatio: '1' }}
                      className={`rounded-sm border cursor-pointer transition-all duration-150 ${riskStyle(state?.risk ?? 0)} ${isHovered ? 'scale-110 z-10 relative brightness-150' : ''} ${state?.risk >= 3 ? 'animate-pulse' : ''}`}
                      onMouseEnter={() => setHoveredState(cell.stateId)}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                  )
                })
              )}
            </div>

            {/* Hover tooltip */}
            {hoveredData && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0A1E35] border border-[#0EA5E9]/30 rounded-lg p-3 text-xs pointer-events-none z-20 min-w-[160px] shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-sm flex-none ${riskStyle(hoveredData.risk)}`} />
                  <span className="text-white font-semibold">{hoveredData.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#3A5A7A]">Water level</span>
                    <span className="font-mono text-[#E2EAF4]">{hoveredData.waterLevelCm} cm</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#3A5A7A]">Trend</span>
                    <span className={`font-mono ${hoveredData.trend === 'rising' ? 'text-[#EF4444]' : hoveredData.trend === 'falling' ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                      {hoveredData.trend === 'rising' ? '↑ Rising' : hoveredData.trend === 'falling' ? '↓ Falling' : '→ Stable'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#3A5A7A]">Alerts sent</span>
                    <span className="font-mono text-[#E2EAF4]">{hoveredData.alertsSent.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-5 flex-wrap">
            {[
              { color: 'bg-[#0A1628]', label: 'No risk' },
              { color: 'bg-[#052E16]', label: 'Low' },
              { color: 'bg-[#0C4A6E]', label: 'Elevated' },
              { color: 'bg-[#78350F]', label: 'High' },
              { color: 'bg-[#7F1D1D]', label: 'Critical' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${color} border border-white/10`} />
                <span className="font-mono text-[10px] text-[#3A5A7A]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live alert feed */}
        <div className="bg-[#040E1C] border border-[#0E2040] rounded-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#0E2040]">
            <h2 className="text-white font-semibold text-base">Live Alerts</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="font-mono text-[10px] text-[#EF4444]">LIVE</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#0E2040]">
            {activeAlerts.map((alert) => {
              const levelColor = alert.level === 'CRITICAL' ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
                : alert.level === 'HIGH' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
                : 'text-[#38BDF8] bg-[#0EA5E9]/10 border-[#0EA5E9]/30'
              return (
                <button
                  key={alert.id}
                  onClick={() => onNavigate('alerts')}
                  className="w-full text-left px-5 py-4 hover:bg-[#0A1E35] transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border tracking-widest ${levelColor}`}>
                      {alert.level}
                    </span>
                    <span className="text-[#2A4060] font-mono text-[10px] ml-auto">
                      {new Date(alert.timestamp).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[#94A3B8] text-xs font-medium mb-1">{alert.state} — {alert.lga}</div>
                  <div className="text-[#3A5A7A] text-[11px] leading-snug line-clamp-2 group-hover:text-[#5A7A9A] transition-colors">{alert.message}</div>
                  <div className="font-mono text-[10px] text-[#1A3050] mt-1.5">
                    {alert.smsSent.toLocaleString()} SMS sent · {(alert.affectedPop / 1000).toFixed(0)}k affected
                  </div>
                </button>
              )
            })}
          </div>
          <div className="p-4 border-t border-[#0E2040]">
            <button
              onClick={() => onNavigate('alerts')}
              className="w-full text-center text-xs text-[#38BDF8] hover:text-[#7DD3FC] transition-colors font-mono"
            >
              View all alerts →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sensor network */}
        <div className="bg-[#040E1C] border border-[#0E2040] rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#0E2040]">
            <h2 className="text-white font-semibold text-base">Sensor Network</h2>
            <span className="font-mono text-[10px] text-[#2A4060]">340 deployed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0E2040]">
                  {['Sensor ID', 'State', 'Depth', 'Trend', 'Battery', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono text-[10px] text-[#2A4060] tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A1628]">
                {SENSORS.slice(0, 6).map(s => (
                  <tr key={s.id} className="hover:bg-[#071424] transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-[#38BDF8]">{s.id}</td>
                    <td className="px-4 py-3 text-xs text-[#94A3B8]">{s.state}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#E2EAF4]">{s.depthCm} cm</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <span className={s.trend === 'rising' ? 'text-[#EF4444]' : s.trend === 'falling' ? 'text-[#22C55E]' : 'text-[#F59E0B]'}>
                        {s.trend === 'rising' ? '↑' : s.trend === 'falling' ? '↓' : '→'} {s.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-[#0E2040] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.batteryPct > 50 ? 'bg-[#22C55E]' : s.batteryPct > 20 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} style={{ width: `${s.batteryPct}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-[#3A5A7A]">{s.batteryPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        s.status === 'online' ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : s.status === 'degraded' ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                          : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent community reports */}
        <div className="bg-[#040E1C] border border-[#0E2040] rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#0E2040]">
            <h2 className="text-white font-semibold text-base">Community Reports</h2>
            <button onClick={() => onNavigate('community')} className="font-mono text-[10px] text-[#38BDF8] hover:text-[#7DD3FC]">View all →</button>
          </div>
          <div className="divide-y divide-[#0A1628]">
            {COMMUNITY_REPORTS.map(r => (
              <div key={r.id} className="px-5 py-3.5 hover:bg-[#071424] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#94A3B8] text-xs font-medium">{r.reporterName}</span>
                      <span className="text-[#1A3050]">·</span>
                      <span className="font-mono text-[10px] text-[#3A5A7A]">{r.lga}, {r.state}</span>
                      {r.verified && <span className="font-mono text-[9px] bg-[#22C55E]/10 text-[#22C55E] px-1.5 rounded">✓ verified</span>}
                    </div>
                    <p className="text-[#3A5A7A] text-xs leading-snug truncate">{r.landmark}</p>
                  </div>
                  <div className="flex-none text-right">
                    <div className={`font-mono text-sm font-semibold ${r.trend === 'rising' ? 'text-[#EF4444]' : r.trend === 'falling' ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                      {r.depthCm} cm
                    </div>
                    <div className={`font-mono text-[10px] ${r.trend === 'rising' ? 'text-[#EF4444]' : r.trend === 'falling' ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                      {r.trend === 'rising' ? '↑ rising' : r.trend === 'falling' ? '↓ falling' : '→ stable'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[#0E2040]">
            <button
              onClick={() => onNavigate('report')}
              className="w-full flex items-center justify-center gap-2 bg-[#0EA5E9]/8 hover:bg-[#0EA5E9]/12 border border-[#0EA5E9]/20 text-[#38BDF8] text-xs font-medium py-2.5 rounded-lg transition-colors"
            >
              <span>Submit a water-level report</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}