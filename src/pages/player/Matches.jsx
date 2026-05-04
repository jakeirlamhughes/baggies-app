import { useState } from 'react'
import { getMatches, getCurrentUser } from '../../store'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function PlayerMatches() {
  const [matches] = useState(getMatches)
  const user = getCurrentUser()

  const sorted = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Layout title="Matches">
      <div className="px-4 py-4">
        {user?.playerName && (
          <p className="text-sm text-gray-500 mb-4">Hey {user.playerName} 👋</p>
        )}

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-500 text-sm">No matches scheduled yet.</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {sorted.map(match => {
            const myStatus = user?.playerId ? match.availability?.[user.playerId] : null
            return (
              <Link
                key={match.id}
                to={`/player/matches/${match.id}`}
                className="block p-4 rounded-xl border border-gray-100 bg-white active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">vs {match.opponent}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(match.date)}{match.time ? ` · ${match.time}` : ''}
                    </p>
                    {match.location && <p className="text-sm text-gray-400">{match.location}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {myStatus && (
                      <StatusBadge status={myStatus} />
                    )}
                    {!myStatus && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                        Respond
                      </span>
                    )}
                    {match.teamSheet?.published && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Sheet out
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

function StatusBadge({ status }) {
  const map = {
    yes: 'bg-green-100 text-green-700',
    no: 'bg-red-100 text-red-700',
    maybe: 'bg-yellow-100 text-yellow-700',
  }
  const label = { yes: 'Available', no: 'Unavailable', maybe: 'Maybe' }
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status]}`}>
      {label[status]}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
}
