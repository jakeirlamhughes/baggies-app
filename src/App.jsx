import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUser } from './store'

import Landing from './pages/Landing'
import Join from './pages/Join'

import CoachMatches from './pages/coach/Matches'
import CoachMatchDetail from './pages/coach/MatchDetail'
import CoachPlayers from './pages/coach/Players'
import MyClub from './pages/coach/MyClub'

import PlayerMatches from './pages/player/Matches'
import PlayerMatchDetail from './pages/player/MatchDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/join" element={<Join />} />

        <Route path="/coach/matches" element={<CoachMatches />} />
        <Route path="/coach/matches/:id" element={<CoachMatchDetail />} />
        <Route path="/coach/players" element={<CoachPlayers />} />
        <Route path="/coach/my-club" element={<MyClub />} />

        <Route path="/player/matches" element={<PlayerMatches />} />
        <Route path="/player/matches/:id" element={<PlayerMatchDetail />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function RootRedirect() {
  const user = getCurrentUser()
  if (!user) return <Landing />
  if (user.role === 'coach') return <Navigate to="/coach/matches" replace />
  return <Navigate to="/player/matches" replace />
}
