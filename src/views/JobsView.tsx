import { useState } from 'react'
import { JOBS } from '../data'
import type { Job } from '../types'

type Category = 'all' | 'field' | 'data' | 'community' | 'training'

const catLabel: Record<string, string> = {
  field: 'Field / Technical',
  data: 'Data & Analytics',
  community: 'Community',
  training: 'Training',
}

const catColor: Record<string, string> = {
  field: 'text-[#38BDF8] bg-[#0EA5E9]/10 border-[#0EA5E9]/30',
  data: 'text-[#A78BFA] bg-[#7C3AED]/10 border-[#7C3AED]/30',
  community: 'text-[#34D399] bg-[#10B981]/10 border-[#10B981]/30',
  training: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
}

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', state: '', cv: '' })

  if (applied) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#040E1C] border border-[#22C55E]/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Application submitted!</h3>
          <p className="text-[#3A5A7A] text-sm mb-6">We will contact you via SMS within 5 working days.</p>
          <button onClick={onClose} className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#38BDF8] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0EA5E9]/15 transition-colors">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#040E1C] border border-[#0E2040] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#0E2040]">
          <div>
            <h3 className="text-white font-semibold">{job.title}</h3>
            <p className="text-[#3A5A7A] text-xs mt-0.5">{job.state}</p>
          </div>
          <button onClick={onClose} className="text-[#2A4060] hover:text-[#6A8AAA] p-1">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-[#5A7A9A] text-sm leading-relaxed">{job.description}</p>

          <div>
            <p className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-2">REQUIREMENTS</p>
            <ul className="space-y-1.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#3A5A7A]">
                  <span className="text-[#22C55E] mt-0.5 flex-none">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#071424] border border-[#0E2040] rounded-lg p-3">
              <p className="font-mono text-[9px] text-[#2A4060] tracking-widest mb-1">SALARY</p>
              <p className="font-mono text-sm font-semibold text-[#22C55E]">₦{job.salaryMonthly.toLocaleString()}/mo</p>
            </div>
            <div className="bg-[#071424] border border-[#0E2040] rounded-lg p-3">
              <p className="font-mono text-[9px] text-[#2A4060] tracking-widest mb-1">DEADLINE</p>
              <p className="font-mono text-sm font-semibold text-[#E2EAF4]">{new Date(job.deadline).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Quick apply form */}
          <div className="border-t border-[#0E2040] pt-5 space-y-4">
            <p className="font-mono text-[10px] text-[#2A4060] tracking-widest">QUICK APPLICATION</p>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Your full name' },
              { key: 'phone', label: 'Phone Number', placeholder: '+234 800 000 0000' },
              { key: 'state', label: 'State of Origin', placeholder: 'Your state' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-1.5">{label.toUpperCase()}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-3 py-2 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block font-mono text-[10px] text-[#2A4060] tracking-widest mb-1.5">BRIEF MOTIVATION (optional)</label>
              <textarea
                rows={2}
                placeholder="Why are you interested in this role?"
                value={form.cv}
                onChange={e => setForm(prev => ({ ...prev, cv: e.target.value }))}
                className="w-full bg-[#071424] border border-[#0E2040] rounded-lg px-3 py-2 text-sm text-[#94A3B8] placeholder-[#1A3050] focus:outline-none focus:border-[#0EA5E9]/40 transition-colors resize-none"
              />
            </div>
            <button
              onClick={() => { if (form.name && form.phone) setApplied(true) }}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JobsView() {
  const [filter, setFilter] = useState<Category>('all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const filtered = filter === 'all' ? JOBS : JOBS.filter(j => j.category === filter)
  const totalJobs = JOBS.reduce((s, j) => s + j.count, 0)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-display text-2xl font-semibold">Green Jobs Board</h1>
          <p className="text-[#3A5A7A] text-sm mt-1">
            <span className="text-[#22C55E] font-mono">{totalJobs}</span> positions building climate-resilient Nigeria
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="font-mono text-[10px] text-[#2A4060] tracking-widest mb-1">NATIONWIDE</div>
          <div className="font-display text-2xl font-semibold text-[#22C55E]">{JOBS.reduce((s, j) => s + j.count, 0)}</div>
          <div className="font-mono text-[10px] text-[#2A4060]">open positions</div>
        </div>
      </div>

      {/* Impact strip */}
      <div className="bg-[#071424] border border-[#0E2040] rounded-xl p-4 flex flex-wrap gap-6 items-center">
        {[
          { icon: '🌱', text: 'Permanent positions — not just one-time contracts' },
          { icon: '📍', text: 'Local hiring — work in your own community' },
          { icon: '📱', text: 'No smartphone required for community roles' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <span className="text-xs text-[#3A5A7A]">{text}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'field', 'data', 'community', 'training'] as Category[]).map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
              filter === c
                ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/8 text-[#38BDF8]'
                : 'border-[#0E2040] text-[#3A5A7A] hover:text-[#6A8AAA]'
            }`}
          >
            {c === 'all' ? `ALL (${JOBS.length})` : `${catLabel[c].toUpperCase()} (${JOBS.filter(j => j.category === c).length})`}
          </button>
        ))}
      </div>

      {/* Job cards */}
      <div className="space-y-4">
        {filtered.map(job => {
          const daysLeft = Math.round((new Date(job.deadline).getTime() - Date.now()) / 86400000)
          return (
            <div
              key={job.id}
              className="bg-[#040E1C] border border-[#0E2040] hover:border-[#152840] rounded-xl p-6 transition-all group cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border tracking-widest ${catColor[job.category]}`}>
                      {catLabel[job.category].toUpperCase()}
                    </span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border tracking-widest ${
                      daysLeft <= 7 ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30' : 'text-[#2A4060] border-[#0E2040]'
                    }`}>
                      {daysLeft}d remaining
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-1 group-hover:text-[#38BDF8] transition-colors">{job.title}</h3>
                  <p className="text-[#3A5A7A] text-xs mb-3">{job.state}</p>
                  <p className="text-[#5A7A9A] text-sm leading-relaxed line-clamp-2">{job.description}</p>
                </div>
                <div className="flex-none text-right">
                  <div className="font-mono text-lg font-semibold text-[#22C55E]">₦{(job.salaryMonthly / 1000).toFixed(0)}k</div>
                  <div className="font-mono text-[10px] text-[#2A4060]">per month</div>
                  <div className="font-mono text-xs text-[#38BDF8] mt-2">{job.count} openings</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#071424]">
                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, 2).map((req, i) => (
                    <span key={i} className="font-mono text-[9px] text-[#2A4060] bg-[#071424] border border-[#0A1628] px-2 py-0.5 rounded">
                      {req.split(' ').slice(0, 4).join(' ')}...
                    </span>
                  ))}
                </div>
                <span className="text-xs text-[#38BDF8] font-mono group-hover:text-[#7DD3FC] transition-colors">Apply →</span>
              </div>
            </div>
          )
        })}
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  )
}
