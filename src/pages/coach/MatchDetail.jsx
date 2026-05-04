import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMatches, getPlayers, publishTeamSheet } from '../../store'
import Layout from '../../components/Layout'

export default function MatchDetail() {
  const { id } = useParams()
  const [matches, setMatches] = useState(getMatches)
  const players = getPlayers()
  const match = matches.find(m => m.id === id)

  const [tab, setTab] = useState('availability') // availability | teamsheet
  const [selectedIds, setSelectedIds] = useState(
    match?.teamSheet?.playerIds || []
  )
  const [published, setPublished] = useState(match?.teamSheet?.published || false)

  if (!match) {
    return (
      <Layout title="Match" back="/coach/matches">
        <div className="text-center py-16 text-gray-500">Match not found.</div>
      </Layout>
    )
  }

  const availability = match.availability || {}

  const yes = players.filter(p => availability[p.id] === 'yes')
  const maybe = players.filter(p => availability[p.id] === 'maybe')
  const no = players.filter(p => availability[p.id] === 'no')
  const noResponse = players.filter(p => !availability[p.id])

  function togglePlayer(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
    setPublished(false)
  }

  function handlePublish() {
    publishTeamSheet(match.id, selectedIds)
    setMatches(getMatches())
    setPublished(true)
  }

  const availablePlayers = [...yes, ...maybe]

  return (
    <Layout title={`vs ${match.opponent}`} back="/coach/matches">
      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {formatDate(match.date)}{match.time ? ` · ${match.time}` : ''}{match.location ? ` · ${match.location}` : ''}
          </p>
        </div>

        {match.notes && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">Match notes</p>
            <p className="text-sm text-green-900 whitespace-pre-line">{match.notes}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('availability')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'availability' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
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
          </button>
        </div>

        {tab === 'availability' && (
          <div className="flex flex-col gap-5">
            <AvailabilityGroup label="Available" count={yes.length} color="green" players={yes} />
            <AvailabilityGroup label="Maybe" count={maybe.length} color="yellow" players={maybe} />
            <AvailabilityGroup label="Unavailable" count={no.length} color="red" players={no} />
            <AvailabilityGroup label="No response" count={noResponse.length} color="gray" players={noResponse} />
          </div>
        )}

        {tab === 'teamsheet' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Select players for the team sheet. Tap to include or remove.
            </p>

            {availablePlayers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                No availability responses yet.
              </p>
            )}

            <div className="flex flex-col gap-2 mb-6">
              {availablePlayers.map(player => {
                const selected = selectedIds.includes(player.id)
                return (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${
                      selected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white active:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      selected ? 'bg-green-600' : 'bg-gray-100'
                    }`}>
                      {selected
                        ? <span className="text-white text-sm">✓</span>
                        : <span className="text-gray-500 text-xs">{player.squadNumber || '—'}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{player.name}</p>
                      <p className="text-xs text-gray-500">{player.position || 'No position'}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      availability[player.id] === 'yes'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {availability[player.id] === 'yes' ? 'Available' : 'Maybe'}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">{selectedIds.length} players selected</p>
            </div>

            <button
              onClick={handlePublish}
              disabled={selectedIds.length === 0}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-base disabled:opacity-40 active:bg-green-700 transition-colors"
            >
              {published ? 'Team sheet published ✓' : 'Publish team sheet'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

function AvailabilityGroup({ label, count, color, players }) {
  const colors = {
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
    gray: 'text-gray-500 bg-gray-100',
  }
  if (count === 0) return null
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>{label}</span>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
      <div className="flex flex-col gap-1">
        {players.map(p => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-gray-100">
            <span className="text-sm text-gray-400 w-6 text-center">{p.squadNumber || '—'}</span>
            <span className="text-sm font-medium text-gray-900">{p.name}</span>
            <span className="text-xs text-gray-400 ml-auto">{p.position || ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' })
}
