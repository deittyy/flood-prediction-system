import { useState, useEffect, type ReactNode } from 'react'
import { LayoutDashboard, Map, Bell, Shield, FileText, Users, Briefcase, ChevronRight } from 'lucide-react'
import type { View } from '../types'

interface NavItem {
  id: View
  label: string
  icon: ReactNode
  badge?: number
}

interface ShellProps {
  view: View
  onNavigate: (v: View) => void
  children: ReactNode
}

export default function Shell({ view, onNavigate, children }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  const [newReports, setNewReports] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const r = setInterval(() => setNewReports((count) => count + 1), 8000)
    return () => clearInterval(r)
  }, [])

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'map', label: 'Live Map', icon: <Map size={18} /> },
    { id: 'alerts', label: 'Alert Centre', icon: <Bell size={18} />, badge: 7 },
    { id: 'evacuation', label: 'Evacuation', icon: <Shield size={18} /> },
    { id: 'report', label: 'Report', icon: <FileText size={18} /> },
    { id: 'community', label: 'Community', icon: <Users size={18} /> },
    { id: 'jobs', label: 'Green Jobs', icon: <Briefcase size={18} />, badge: 5 },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-[#0E2040] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center flex-none shadow-lg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 10 Q5 6 8 8 Q11 10 14 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="8" cy="4" r="2" fill="white"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-semibold text-sm leading-none">EcoLink <span className="text-[#38BDF8]">AI</span></div>
            <div className="text-[#3A6080] text-[10px] mt-0.5 font-mono tracking-wide">Flood Intelligence</div>
          </div>
        )}
      </div>

      {/* Live status pill */}
      {!collapsed && (
        <div className="mx-4 mt-4 mb-2 flex items-center gap-2 bg-[#0A1E35] rounded-lg px-3 py-2 border border-[#0E2040]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-[pulse_1.2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(34,197,94,0.35)] flex-none" />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#22C55E] tracking-wide">System Live</span>
            <span className="font-mono text-[9px] text-[#94A3B8]">{newReports} new reports</span>
          </div>
          <span className="font-mono text-[10px] text-[#2A4A6A] ml-auto">
            {time.toLocaleTimeString('en-NG', { hour12: false })}
          </span>
        </div>
      )}

      {/* Nav section label */}
      {!collapsed && (
        <div className="px-5 mt-4 mb-1">
          <span className="font-mono text-[9px] text-[#2A4060] tracking-widest">NAVIGATION</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                active
                  ? 'bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/20'
                  : 'text-[#4A6A8A] hover:bg-[#0A1E35] hover:text-[#94A3B8] border border-transparent'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`flex-none transition-colors ${active ? 'text-[#38BDF8]' : 'text-[#3A5A7A] group-hover:text-[#6A8AAA]'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-[#0EA5E9]/20 text-[#38BDF8]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                }`}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:block p-3 border-t border-[#0E2040]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#2A4060] hover:text-[#4A6A8A] hover:bg-[#0A1E35] transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M10 3L6 8l4 5"/>
          </svg>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>

      {/* User footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#0E2040]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold flex-none">AM</div>
            <div className="min-w-0 flex-1">
              <div className="text-[#CBD5E1] text-xs font-medium truncate">Abubakar Musa</div>
              <div className="text-[#2A4060] text-[10px] font-mono truncate">Admin · Kogi State</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen bg-[#030C1A] overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-none bg-[#040E1C] border-r border-[#0E2040] transition-all duration-200 ${
          collapsed ? 'w-[60px]' : 'w-[220px]'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[240px] bg-[#040E1C] border-r border-[#0E2040] flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex-none h-14 bg-[#040E1C] border-b border-[#0E2040] flex items-center gap-4 px-5">
          {/* Mobile menu */}
          <button
            className="lg:hidden text-[#3A5A7A] hover:text-[#6A8AAA] flex-none"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/>
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
            <span className="text-[#2A4060]">EcoLink AI</span>
            <span className="text-[#1A3050]"><ChevronRight size={16} /></span>
            <span className="text-[#94A3B8] font-medium truncate capitalize">
              {navItems.find(n => n.id === view)?.label ?? view}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-none">
            {/* Active alerts indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-[#0A1E35] border border-[#EF4444]/25 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="font-mono text-[11px] text-[#EF4444]">7 active alerts</span>
            </div>

            {/* Notification bell */}
            <button className="relative w-8 h-8 flex items-center justify-center text-[#3A5A7A] hover:text-[#6A8AAA] hover:bg-[#0A1E35] rounded-lg transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M9 2a5 5 0 015 5v4l1.5 2H2.5L4 11V7a5 5 0 015-5z"/>
                <path d="M7 15a2 2 0 004 0"/>
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] border border-[#040E1C]" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex-none bg-[#040E1C] border-t border-[#0E2040] flex">
          {navItems.slice(0, 5).map((item) => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-colors ${
                  active ? 'text-[#38BDF8]' : 'text-[#2A4060]'
                }`}
              >
                {item.icon}
                <span className="text-[9px] font-mono tracking-wide">{item.label.split(' ')[0]}</span>
                {item.badge && (
                  <span className="absolute top-1.5 right-1/4 w-2 h-2 rounded-full bg-[#EF4444]" />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
