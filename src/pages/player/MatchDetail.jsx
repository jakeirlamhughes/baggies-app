import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMatches, getPlayers, setAvailability, getCurrentUser } from '../../store'
import Layout from '../../components/Layout'

export default function PlayerMatchDetail() {
  const { id } = useParams()
  const [matches, setMatches] = useState(getMatches)
  const players = getPlayers()
  const user = getCurrentUser()

  const match = matches.find(m => m.id === id)

  if (!match) {
    return (
      <Layout title="Match" back="/player/matches">
        <div className="text-center py-16 text-gray-500">Match not found.</div>
      </Layout>
    )
  }

  const myStatus = user?.playerId ? match.availability?.[user.playerId] : null
  const hasTeamSheet = match.teamSheet?.published
  const teamSheetPlayerIds = match.teamSheet?.playerIds || []
  const teamSheetPlayers = teamSheetPlayerIds.map(pid => players.find(p => p.id === pid)).filter(Boolean)

  const [tab, setTab] = useState(hasTeamSheet ? 'teamsheet' : 'rsvp')

  function respond(status) {
    if (!user?.playerId) return
    setAvailability(match.id, user.playerId, status)
    setMatches(getMatches())
  }

  return (
    <Layout title={`vs ${match.opponent}`} back="/player/matches">
      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {formatDate(match.date)}{match.time ? ` · ${match.time}` : ''}{match.location ? ` · ${match.location}` : ''}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('rsvp')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'rsvp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setTab('teamsheet')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'teamsheet' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Team sheet
            {hasTeamSheet && <span className="ml-1 text-green-600">•</span>}
          </button>
        </div>

        {tab === 'rsvp' && (
          <div>
            {!user?.playerId ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-4">You haven't joined the squad yet.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6">Are you available for this match?</p>
                <div className="flex flex-col gap-3">
                  <RSVPButton
                    label="I'm available"
                    sublabel="I'll be there"
                    status="yes"
                    current={myStatus}
                    onClick={() => respond('yes')}
                    color="green"
                  />
                  <RSVPButton
                    label="Maybe"
                    sublabel="Not sure yet"
                    status="maybe"
                    current={myStatus}
                    onClick={() => respond('maybe')}
                    color="yellow"
                  />
                  <RSVPButton
                    label="Can't make it"
                    sublabel="Unavailable"
                    status="no"
                    current={myStatus}
                    onClick={() => respond('no')}
                    color="red"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'teamsheet' && (
          <div>
            {!hasTeamSheet ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">⏳</div>
                <p className="text-gray-500 text-sm">Team sheet not published yet.</p>
                <p className="text-gray-400 text-xs mt-1">Check back closer to the match.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">{teamSheetPlayers.length} players selected</p>
                <div className="flex flex-col gap-2">
                  {teamSheetPlayers.map((player, i) => {
                    const isMe = player.id === user?.playerId
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${
                          isMe ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          isMe ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {player.squadNumber || i + 1}
                        </div>
                        <div>
                          <p className={`font-semibold ${isMe ? 'text-green-800' : 'text-gray-900'}`}>
                            {player.name} {isMe && '(You)'}
                          </p>
                          <p className="text-xs text-gray-500">{player.position || 'No position'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

function RSVPButton({ label, sublabel, status, current, onClick, color }) {
  const selected = current === status
  const styles = {
    green: selected
      ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
      : 'border-gray-200 active:bg-gray-50',
    yellow: selected
      ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400'
      : 'border-gray-200 active:bg-gray-50',
    red: selected
      ? 'border-red-400 bg-red-50 ring-1 ring-red-400'
      : 'border-gray-200 active:bg-gray-50',
  }
  const icons = { green: '✓', yellow: '?', red: '✗' }
  const iconColors = {
    green: selected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400',
    yellow: selected ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-400',
    red: selected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400',
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${styles[color]}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors ${iconColors[color]}`}>
        {icons[color]}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{sublabel}</p>
      </div>
    </button>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' })
}
