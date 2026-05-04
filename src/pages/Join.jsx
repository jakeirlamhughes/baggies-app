import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlayers, claimPlayer, setCurrentUser, getClub } from '../store'

export default function Join() {
  const navigate = useNavigate()
  const club = getClub()
  const players = getPlayers()
  const unclaimed = players.filter(p => !p.claimed)

  const [step, setStep] = useState('pick') // pick | name
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [name, setName] = useState('')

  function handlePick(player) {
    setSelectedPlayer(player)
    setName(player.name)
    setStep('name')
  }

  function handleJoin() {
    if (!name.trim()) return
    claimPlayer(selectedPlayer.id, name.trim())
    setCurrentUser({ role: 'player', playerId: selectedPlayer.id, playerName: name.trim() })
    navigate('/player/matches')
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh px-6 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No players added yet</h2>
        <p className="text-gray-500 text-sm">Ask your coach to add players before you join.</p>
      </div>
    )
  }

  if (unclaimed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh px-6 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">All players have joined</h2>
        <p className="text-gray-500 text-sm">If you can't find yourself, ask your coach.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-svh bg-white">
      <div className="px-4 pt-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          {club.badge ? (
            <img src={club.badge} alt="Club badge" className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">B</span>
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{club.name || 'The Baggies'}</h1>
            <p className="text-sm text-gray-500">Join the squad</p>
          </div>
        </div>
      </div>

      {step === 'pick' && (
        <div className="px-4 pt-6">
          <p className="text-sm text-gray-500 mb-4">Find your name and tap to claim your spot.</p>
          <div className="flex flex-col gap-2">
            {unclaimed.map(player => (
              <button
                key={player.id}
                onClick={() => handlePick(player)}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 text-left active:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-700 font-bold text-sm">
                    {player.squadNumber || '#'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{player.name}</p>
                  <p className="text-sm text-gray-500">{player.position || 'No position set'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'name' && (
        <div className="px-4 pt-6 flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Claiming spot for</p>
            <p className="text-lg font-semibold text-gray-900">{selectedPlayer.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleJoin}
              disabled={!name.trim()}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-base disabled:opacity-40 active:bg-green-700 transition-colors"
            >
              Join the squad
            </button>
            <button
              onClick={() => setStep('pick')}
              className="w-full py-3 text-gray-500 text-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
