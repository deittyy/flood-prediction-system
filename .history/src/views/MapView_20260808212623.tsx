import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { NIGERIA_STATES } from '../data'
import { NIGERIA_SVG_PATHS } from '../data/nigeriaMapPaths'
import type { NigeriaState } from '../types'

const RISK_LABELS = ['No Risk', 'Low', 'Elevated', 'High', 'Critical']
const RISK_BG = ['bg-[#0A1628]', 'bg-[#052E16]', 'bg-[#0C4A6E]', 'bg-[#78350F]', 'bg-[#7F1D1D]']
const RISK_BORDER = ['border-[#0E2040]/80', 'border-[#22C55E]/30', 'border-[#0EA5E9]/40', 'border-[#F59E0B]/50', 'border-[#EF4444]/60']
const RISK_TEXT = ['text-[#3A5A7A]', 'text-[#22C55E]', 'text-[#38BDF8]', 'text-[#F59E0B]', 'text-[#EF4444]']
const RISK_FILL = ['#06101F', '#0D2C4B', '#0E5A86', '#7C4A1D', '#7F1D1D']
const RISK_STROKE = ['#0E2040', '#16426D', '#1D6EB1', '#F59E0B', '#EF4444']

type ForecastHour = 0 | 24 | 48 | 72

const forecastMultiplier: Record<ForecastHour, number> = { 0: 1, 24: 1.1, 48: 1.2, 72: 1.35 }

export default function MapView() {
  const [selectedState, setSelectedState] = useState<NigeriaState | null>(null)
  const [hoveredState, setHoveredState] = useState<NigeriaState | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [filterRisk, setFilterRisk] = useState<number | null>(null)
  const [forecastHour, setForecastHour] = useState<ForecastHour>(0)

  // MAPPING: SVG ID → state ID
  const SVG_TO_STATE_ID: Record<string, string> = {
    'NGKE': 'kebbi', 'NGNI': 'niger', 'NGKW': 'kwara', 'NGOG': 'ogun',
    'NGOY': 'oyo', 'NGLA': 'lagos', 'NGBO': 'borno', 'NGAD': 'adamawa',
    'NGTA': 'taraba', 'NGBE': 'benue', 'NGCR': 'cross-river', 'NGSO': 'sokoto',
    'NGZA': 'zamfara', 'NGYO': 'yobe', 'NGKT': 'katsina', 'NGJI': 'jigawa',
    'NGON': 'ondo', 'NGDE': 'delta', 'NGBY': 'bayelsa', 'NGRI': 'rivers',
    'NGAK': 'akwa-ibom', 'NGAB': 'abia', 'NGEB': 'ebonyi', 'NGAN': 'anambra',
    'NGED': 'edo', 'NGBA': 'bauchi', 'NGPL': 'plateau', 'NGNA': 'nasarawa',
    'NGGO': 'gombe', 'NGEN': 'enugu', 'NGKO': 'kogi', 'NGOS': 'osun',
    'NGIM': 'imo', 'NGEK': 'ekiti', 'NGKD': 'kaduna', 'NGKN': 'kano',
    'NGFC': 'fct',
  }

  // Map SVG IDs to state data
  const stateMap = Object.fromEntries(
    NIGERIA_SVG_PATHS.map(path => {
      const stateId = SVG_TO_STATE_ID[path.svgId]
      const state = NIGERIA_STATES.find(s => s.id === stateId)
      return [path.svgId, state]
    }).filter(([_, state]) => state !== undefined)
  )

  const trendData = selectedState ? [
    { time: 'Now', level: selectedState.waterLevelCm },
    { time: '+24h', level: Math.round(selectedState.waterLevelCm * 1.1) },
    { time: '+48h', level: Math.round(selectedState.waterLevelCm * 1.2) },
    { time: '+72h', level: Math.round(selectedState.waterLevelCm * 1.35) },
  ] : []

  const getProjectedRisk = (state: NigeriaState, hour: ForecastHour): number => {
    if (hour === 0) return state.risk
    const mult = forecastMultiplier[hour]
    return Math.min(4, Math.round(state.risk * mult))
  }

  const riskFill = (risk: number): string => RISK_FILL[risk]
  const riskStroke = (risk: number): string => RISK_STROKE[risk]

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">

      {/* Map panel */}
      <div className="flex-1 p-6 flex flex-col min-h-0">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <h1 className="text-white font-display text-xl font-semibold flex-1">Live Flood Risk Map</h1>

          {/* Forecast slider */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#2A4060] tracking-wide">FORECAST</span>
            {([0, 24, 48, 72] as ForecastHour[]).map(h => (
              <button
                key={h}
                onClick={() => setForecastHour(h)}
                className={`font-mono text-[11px] px-2.5 py-1 rounded border transition-all ${
                  forecastHour === h
                    ? 'border-[#0EA5E9]/50 bg-[#0EA5E9]/10 text-[#38BDF8]'
                    : 'border-[#0E2040] text-[#3A5A7A] hover:text-[#6A8AAA]'
                }`}
              >
                {h === 0 ? 'Now' : `+${h}h`}
              </button>
            ))}
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-1">
            {[null, 2, 3, 4].map((r) => (
              <button
                key={r ?? 'all'}
                onClick={() => setFilterRisk(r === filterRisk ? null : r)}
                className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-all ${
                  filterRisk === r
                    ? 'border-[#0EA5E9]/50 bg-[#0EA5E9]/10 text-[#38BDF8]'
                    : 'border-[#0E2040] text-[#3A5A7A] hover:text-[#6A8AAA]'
                }`}
              >
                {r === null ? 'All' : RISK_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[980px]">
            <div className="relative">
              <div className="aspect-[5/4] bg-[#071424] rounded-3xl border border-[#0E2040] overflow-hidden shadow-[0_0_0_1px_rgba(14,32,64,0.4)]">
                <svg viewBox="-10 -10 1000 780" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                  {NIGERIA_SVG_PATHS.map(pathEntry => {
                    const state = stateMap[pathEntry.svgId]
                    if (!state) return null
                    const projectedRisk = getProjectedRisk(state, forecastHour)
                    const isSelected = selectedState?.id === state.id
                    const isHovered = hoveredState?.id === state.id
                    const dimmed = filterRisk !== null && projectedRisk !== filterRisk

                    return (
                      <path
                        key={pathEntry.svgId}
                        d={pathEntry.d}
                        fill={riskFill(projectedRisk)}
                        fillOpacity={isHovered ? 0.95 : 1}
                        stroke={isSelected || isHovered ? '#FFFFFF' : riskStroke(projectedRisk)}
                        strokeWidth={isSelected || isHovered ? 2 : 0.8}
                        opacity={dimmed ? 0.25 : 1}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => setSelectedState(isSelected ? null : state)}
                        onMouseEnter={() => setHoveredState(state)}
                        onMouseMove={(e) => {
                          const svg = e.currentTarget.ownerSVGElement
                          if (!svg) return
                          const rect = svg.getBoundingClientRect()
                          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                        }}
                        onMouseLeave={() => {
                          setHoveredState(null)
                          setTooltipPos(null)
                        }}
                        title={`${state.name} — ${RISK_LABELS[projectedRisk]} risk`}
                      />
                    )
                  })}
                </svg>
              </div>

              {hoveredState && tooltipPos && (
                <div
                  className="pointer-events-none absolute z-20 rounded-2xl border border-[#0E2040] bg-[#03111F]/95 p-3 text-xs text-white shadow-2xl"
                  style={{ left: tooltipPos.x + 12, top: tooltipPos.y + 12, minWidth: 180, maxWidth: 260 }}
                >
                  <div className="font-semibold text-sm text-white mb-1">{hoveredState.name}</div>
                  <div className="text-[#94A3B8] mb-2 text-[11px]">
                    {hoveredState.region} · {RISK_LABELS[getProjectedRisk(hoveredState, forecastHour)]} risk
                  </div>
                  <div className="grid gap-1">
                    <div className="flex items-center justify-between text-[11px] text-[#E2EAF4]"><span>Water level</span><span>{hoveredState.waterLevelCm} cm</span></div>
                    <div className="flex items-center justify-between text-[11px] text-[#E2EAF4]"><span>Trend</span><span>{hoveredState.trend === 'rising' ? '↑ Rising' : hoveredState.trend === 'falling' ? '↓ Falling' : '→ Stable'}</span></div>
                    <div className="flex items-center justify-between text-[11px] text-[#E2EAF4]"><span>Population</span><span>{(hoveredState.population / 1000000).toFixed(1)}M</span></div>
                  </div>
                </div>
              )}

            {/* Legend */}
            <div className="flex gap-4 mt-4 flex-wrap justify-center">
              {RISK_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: RISK_FILL[i], border: `1px solid ${RISK_STROKE[i]}` }} />
                  <span className="font-mono text-[10px] text-[#3A5A7A]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail sidebar */}
      <div className="w-full lg:w-[300px] bg-[#040E1C] border-t lg:border-t-0 lg:border-l border-[#0E2040] overflow-y-auto">
        {selectedState ? (
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">{selectedState.name}</h2>
                <p className="font-mono text-[11px] text-[#2A4060] tracking-wide capitalize mt-0.5">{selectedState.region}</p>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="text-[#2A4060] hover:text-[#6A8AAA] p-1"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8"/>
                </svg>
              </button>
            </div>

            {/* Risk badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-5 ${RISK_BG[selectedState.risk]} ${RISK_BORDER[selectedState.risk]}`}>
              <span className={`font-mono text-xs font-semibold ${RISK_TEXT[selectedState.risk]}`}>
                {RISK_LABELS[selectedState.risk]} Risk
              </span>
              {selectedState.risk >= 3 && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Water Level', value: `${selectedState.waterLevelCm} cm`, highlight: selectedState.waterLevelCm > 200 },
                { label: 'Trend', value: selectedState.trend === 'rising' ? '↑ Rising' : selectedState.trend === 'falling' ? '↓ Falling' : '→ Stable', highlight: selectedState.trend === 'rising' },
                { label: 'Population', value: (selectedState.population / 1000000).toFixed(1) + 'M', highlight: false },
                { label: 'Alerts Sent', value: selectedState.alertsSent.toLocaleString(), highlight: false },
                { label: 'Sensors', value: `${selectedState.sensorsOnline}/${selectedState.sensorsTotal}`, highlight: selectedState.sensorsOnline < selectedState.sensorsTotal },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="bg-[#071424] border border-[#0E2040] rounded-lg p-3">
                  <div className="font-mono text-[9px] text-[#2A4060] tracking-widest mb-1">{label.toUpperCase()}</div>
                  <div className={`font-mono text-sm font-semibold ${highlight ? 'text-[#EF4444]' : 'text-[#E2EAF4]'}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* 72-hour forecast bar */}
            <div className="mb-5">
              <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-3">72-HOUR WATER LEVEL FORECAST</p>
              <div className="space-y-2">
                {([0, 24, 48, 72] as ForecastHour[]).map(h => {
                  const mult = forecastMultiplier[h]
                  const projected = Math.round(selectedState.waterLevelCm * mult)
                  const pct = Math.min(100, (projected / 400) * 100)
                  return (
                    <div key={h} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#3A5A7A] w-8">{h === 0 ? 'Now' : `+${h}h`}</span>
                      <div className="flex-1 h-1.5 bg-[#0E2040] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${projected > 300 ? 'bg-[#EF4444]' : projected > 200 ? 'bg-[#F59E0B]' : 'bg-[#0EA5E9]'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#5A7A9A] w-14 text-right">{projected} cm</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Water Level Trend */}
            <div className="mb-5">
              <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-3">WATER LEVEL TREND</p>
              <div className="bg-[#071424] border border-[#0E2040] rounded-2xl p-3">
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6A8195', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6A8195', fontSize: 10 }} width={30} />
                    <Tooltip contentStyle={{ background: '#040E1C', border: '1px solid #0E2040' }} itemStyle={{ color: '#E2EAF4' }} labelStyle={{ color: '#94A3B8' }} />
                    <Line type="monotone" dataKey="level" stroke="#38BDF8" strokeWidth={2} dot={{ fill: '#38BDF8', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sensor health */}
            <div>
              <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">SENSOR HEALTH</p>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-[#0E2040] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22C55E] rounded-full"
                    style={{ width: `${(selectedState.sensorsOnline / selectedState.sensorsTotal) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-[#22C55E]">{selectedState.sensorsOnline}/{selectedState.sensorsTotal}</span>
              </div>
              <p className="font-mono text-[10px] text-[#3A5A7A]">
                {selectedState.sensorsTotal - selectedState.sensorsOnline} sensor{selectedState.sensorsTotal - selectedState.sensorsOnline !== 1 ? 's' : ''} offline
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#071424] border border-[#0E2040] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2A4060" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 6 Q5 2 10 4 Q15 6 18 3M10 4v12"/>
              </svg>
            </div>
            <p className="text-[#3A5A7A] text-sm font-medium mb-1">Select a state</p>
            <p className="text-[#1A3050] text-xs">Click any cell on the map to view detailed flood data and forecasts</p>

            {/* Summary stats */}
            <div className="mt-8 w-full space-y-3">
              <p className="font-mono text-[10px] text-[#2A4060] tracking-widest text-left">NATIONAL SUMMARY</p>
              {[
                { label: 'Critical states', value: NIGERIA_STATES.filter(s => s.risk === 4).length, color: 'text-[#EF4444]' },
                { label: 'High risk states', value: NIGERIA_STATES.filter(s => s.risk === 3).length, color: 'text-[#F59E0B]' },
                { label: 'Elevated risk states', value: NIGERIA_STATES.filter(s => s.risk === 2).length, color: 'text-[#38BDF8]' },
                { label: 'Low / no risk', value: NIGERIA_STATES.filter(s => s.risk <= 1).length, color: 'text-[#22C55E]' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-[#3A5A7A]">{label}</span>
                  <span className={`font-mono text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}