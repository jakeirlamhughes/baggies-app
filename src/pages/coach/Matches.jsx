import { useState } from 'react'
import { getMatches, addMatch } from '../../store'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function Matches() {
  const [matches, setMatches] = useState(getMatches)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ opponent: '', date: '', time: '', location: '', notes: '' })

  function handleAdd() {
    if (!form.opponent.trim() || !form.date) return
    addMatch({
      opponent: form.opponent.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      notes: form.notes.trim(),
    })
    setMatches(getMatches())
    setForm({ opponent: '', date: '', time: '', location: '', notes: '' })
    setShowForm(false)
  }

  const sorted = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Layout title="Matches">
      <div className="px-4 py-4">
        {matches.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-500 text-sm">No matches yet. Add your first fixture.</p>
          </div>
        )}

        {sorted.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {sorted.map(match => {
              const yesCount = Object.values(match.availability).filter(v => v === 'yes').length
              const noCount = Object.values(match.availability).filter(v => v === 'no').length
              const maybeCount = Object.values(match.availability).filter(v => v === 'maybe').length
              return (
                <Link
                  key={match.id}
                  to={`/coach/matches/${match.id}`}
                  className="block p-4 rounded-xl border border-gray-100 bg-white active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">vs {match.opponent}</p>
                      <p className="text-sm text-gray-500">{formatDate(match.date)}{match.time ? ` · ${match.time}` : ''}</p>
                      {match.location && <p className="text-sm text-gray-400">{match.location}</p>}
                    </div>
                    {match.teamSheet?.published && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                        Sheet out
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="text-green-600 font-medium">✓ {yesCount}</span>
                    <span className="text-red-500 font-medium">✗ {noCount}</span>
                    <span className="text-yellow-500 font-medium">? {maybeCount}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {showForm && (
          <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Add match</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opponent *</label>
              <input
                type="text"
                value={form.opponent}
                onChange={e => setForm({ ...form, opponent: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Ponsonby FC"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Western Springs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="e.g. Meet at 12:30, bring black shorts"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm active:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.opponent.trim() || !form.date}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 active:bg-green-700"
              >
                Add match
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 border-2 border-dashed border-gray-200 text-green-600 rounded-xl font-semibold text-sm active:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add match
          </button>
        )}
      </div>
    </Layout>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
}
