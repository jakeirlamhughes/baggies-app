import { Link, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../store'

const coachNav = [
  { to: '/coach/matches', label: 'Matches', icon: CalendarIcon },
  { to: '/coach/players', label: 'Players', icon: PeopleIcon },
  { to: '/coach/my-club', label: 'My Club', icon: ShieldIcon },
]

const playerNav = [
  { to: '/player/matches', label: 'Matches', icon: CalendarIcon },
]

export default function Layout({ children, title, back }) {
  const location = useLocation()
  const user = getCurrentUser()
  const nav = user?.role === 'coach' ? coachNav : playerNav

  return (
    <div className="flex flex-col min-h-svh">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        {back && (
          <Link to={back} className="text-gray-500 -ml-1 p-1">
            <ChevronLeft />
          </Link>
        )}
        <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>
      </header>

      <main className="flex-1 pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 flex">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function CalendarIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function PeopleIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ShieldIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}
