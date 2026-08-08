import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { View } from './types'
import Shell from './components/Shell'
import LandingView from './views/LandingView'
import DashboardView from './views/DashboardView'
import MapView from './views/MapView'
import AlertsView from './views/AlertsView'
import EvacuationView from './views/EvacuationView'
import ReportView from './views/ReportView'
import CommunityView from './views/CommunityView'
import JobsView from './views/JobsView'

export default function App() {
  const [view, setView] = useState<View>('landing')

  const navigate = (v: View) => setView(v)

  if (view === 'landing') {
    return <LandingView onLaunch={navigate} />
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView onNavigate={navigate} />
      case 'map': return <MapView />
      case 'alerts': return <AlertsView />
      case 'evacuation': return <EvacuationView />
      case 'report': return <ReportView />
      case 'community': return <CommunityView />
      case 'jobs': return <JobsView />
      default: return <DashboardView onNavigate={navigate} />
    }
  }

  return (
    <Shell view={view} onNavigate={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Shell>
  )
}
