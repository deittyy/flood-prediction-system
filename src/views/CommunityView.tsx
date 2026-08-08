import { useState } from 'react'
import { COMMUNITY_REPORTS, LEADERBOARD } from '../data'

const MY_STATS = { reports: 84, points: 2940, rank: 1, streak: 28, badge: 'Flood Guardian' }

const BADGES = [
  { name: 'Flood Guardian', icon: '🛡', desc: '200+ verified reports', earned: true },
  { name: 'River Watcher', icon: '👁', desc: '100+ verified reports', earned: true },
  { name: 'First Responder', icon: '⚡', desc: 'Reported during CRITICAL alert', earned: true },
  { name: 'Community Champion', icon: '🏆', desc: '7-day reporting streak', earned: true },
  { name: 'Data Scientist', icon: '📊', desc: '500+ reports total', earned: false },
  { name: 'Night Watch', icon: '🌙', desc: '10 reports between midnight–6am', earned: false },
]

export default function CommunityView() {
  const [tab, setTab] = useState<'feed' | 'leaderboard' | 'mybadges'>('feed')

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white font-display text-2xl font-semibold">Community Hub</h1>
        <p className="text-[#3A5A7A] text-sm mt-1">Real-time observations from citizen reporters across Nigeria</p>
      </div>

      {/* My stats card */}
      <div className="bg-gradient-to-r from-[#040E1C] to-[#071424] border border-[#0EA5E9]/20 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0284C7] to-[#7C3AED] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              AM
            </div>
            <div>
              <div className="text-white font-semibold">Abubakar Musa</div>
              <div className="font-mono text-[11px] text-[#38BDF8] mt-0.5">
                {MY_STATS.badge} · Rank #{MY_STATS.rank} National
              </div>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: 'Reports', value: MY_STATS.reports, color: 'text-[#38BDF8]' },
              { label: 'Points', value: MY_STATS.points.toLocaleString(), color: 'text-[#A78BFA]' },
              { label: 'Streak', value: `${MY_STATS.streak}d`, color: 'text-[#F59E0B]' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`font-display text-2xl font-semibold ${color}`}>{value}</div>
                <div className="font-mono text-[10px] text-[#2A4060] tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Progress to next reward */}
        <div className="mt-5 pt-4 border-t border-[#0E2040]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-[#2A4060] tracking-widest">POINTS TO NEXT AIRTIME REWARD</span>
            <span className="font-mono text-[11px] text-[#A78BFA]">{MY_STATS.points % 500}/500</span>
          </div>
          <div className="h-1.5 bg-[#0E2040] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-full" style={{ width: `${(MY_STATS.points % 500) / 5}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['feed', 'leaderboard', 'mybadges'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[11px] tracking-wider px-4 py-2 rounded-lg border transition-all ${
              tab === t
                ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/8 text-[#38BDF8]'
                : 'border-[#0E2040] text-[#3A5A7A] hover:text-[#6A8AAA]'
            }`}
          >
            {t === 'feed' ? 'Live Feed' : t === 'leaderboard' ? 'Leaderboard' : 'My Badges'}
          </button>
        ))}
      </div>

      {/* Feed */}
      {tab === 'feed' && (
        <div className="space-y-3">
          {COMMUNITY_REPORTS.map(r => {
            const trendColor = r.trend === 'rising' ? 'text-[#EF4444]' : r.trend === 'falling' ? 'text-[#22C55E]' : 'text-[#F59E0B]'
            const trendIcon = r.trend === 'rising' ? '↑' : r.trend === 'falling' ? '↓' : '→'
            const timeAgo = Math.round((Date.now() - new Date(r.timestamp).getTime()) / 60000)
            return (
              <div key={r.id} className="bg-[#040E1C] border border-[#0E2040] hover:border-[#152840] rounded-xl p-5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#071424] border border-[#0E2040] flex items-center justify-center flex-none text-xs font-bold text-[#38BDF8]">
                    {r.reporterName.split(' ').map(p => p[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[#94A3B8] text-sm font-medium">{r.reporterName}</span>
                      {r.verified && (
                        <span className="font-mono text-[9px] bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-1.5 py-0.5 rounded tracking-wide">✓ VERIFIED</span>
                      )}
                      <span className="font-mono text-[10px] text-[#1A3050] ml-auto">{timeAgo}m ago</span>
                    </div>
                    <p className="text-[#3A5A7A] text-xs mb-2">{r.lga}, {r.state} · {r.landmark}</p>
                    {r.notes && <p className="text-[#5A7A9A] text-xs leading-relaxed mb-3">{r.notes}</p>}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 ${trendColor}`}>
                        <span className="font-display text-xl font-semibold">{r.depthCm}</span>
                        <div>
                          <div className="font-mono text-[9px] opacity-70">cm depth</div>
                          <div className={`font-mono text-[10px] font-semibold`}>{trendIcon} {r.trend}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-[#A78BFA] text-xs">+{r.points} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="text-center py-4">
            <span className="font-mono text-[11px] text-[#1A3050]">Showing 6 of 8,841 reports</span>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <div className="bg-[#040E1C] border border-[#0E2040] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#0E2040] flex items-center justify-between">
            <p className="font-mono text-[10px] text-[#2A4060] tracking-widest">NATIONAL LEADERBOARD — AUGUST 2026</p>
            <span className="font-mono text-[10px] text-[#2A4060]">Top 500 reporters</span>
          </div>
          <div className="divide-y divide-[#071424]">
            {LEADERBOARD.map(entry => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#071424] ${entry.rank === 1 ? 'bg-[#0EA5E9]/3' : ''}`}
              >
                <span className={`font-mono text-sm font-semibold w-6 flex-none text-center ${
                  entry.rank === 1 ? 'text-[#F59E0B]' : entry.rank === 2 ? 'text-[#94A3B8]' : entry.rank === 3 ? 'text-[#CD7C2F]' : 'text-[#2A4060]'
                }`}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#071424] border border-[#0E2040] flex items-center justify-center text-xs font-bold text-[#38BDF8] flex-none">
                  {entry.name.split(' ').map(p => p[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#94A3B8] text-sm font-medium truncate">{entry.name}</div>
                  <div className="font-mono text-[10px] text-[#2A4060]">{entry.lga}, {entry.state}</div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[#5A9A7A] bg-[#22C55E]/5 border border-[#22C55E]/15 rounded px-2 py-0.5 text-[10px] font-mono flex-none">
                  {entry.badge}
                </div>
                <div className="text-right flex-none">
                  <div className="font-mono text-sm font-semibold text-[#E2EAF4]">{entry.totalPoints.toLocaleString()}</div>
                  <div className="font-mono text-[10px] text-[#2A4060]">{entry.reportsThisMonth} this month</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {tab === 'mybadges' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map(badge => (
            <div
              key={badge.name}
              className={`bg-[#040E1C] border rounded-xl p-5 transition-all ${
                badge.earned
                  ? 'border-[#A78BFA]/25 hover:border-[#A78BFA]/40'
                  : 'border-[#0E2040] opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl mb-3">{badge.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{badge.name}</h3>
              <p className="text-[#3A5A7A] text-xs">{badge.desc}</p>
              {badge.earned && (
                <div className="mt-3 font-mono text-[9px] text-[#A78BFA] tracking-widest">✓ EARNED</div>
              )}
              {!badge.earned && (
                <div className="mt-3 font-mono text-[9px] text-[#1A3050] tracking-widest">LOCKED</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
