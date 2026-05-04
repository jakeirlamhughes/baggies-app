import { useNavigate } from 'react-router-dom'
import { setCurrentUser, getClub } from '../store'

export default function Landing() {
  const navigate = useNavigate()
  const club = getClub()

  function loginAs(role) {
    setCurrentUser({ role })
    navigate(role === 'coach' ? '/coach/matches' : '/player/matches')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-6 bg-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          {club.badge ? (
            <img src={club.badge} alt="Club badge" className="w-24 h-24 object-contain mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mb-4">
              <span className="text-white text-3xl font-bold">B</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{club.name || 'The Baggies'}</h1>
          <p className="text-gray-500 text-sm mt-1">Who are you?</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => loginAs('coach')}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-base active:bg-green-700 transition-colors"
          >
            Coach / Admin
          </button>
          <button
            onClick={() => loginAs('player')}
            className="w-full py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold text-base active:bg-gray-200 transition-colors"
          >
            Player
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Prototype — no real login
        </p>
      </div>
    </div>
  )
}
