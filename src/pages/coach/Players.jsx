import { useState } from 'react'
import { getPlayers, addPlayer } from '../../store'
import Layout from '../../components/Layout'

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

export default function Players() {
  const [players, setPlayers] = useState(getPlayers)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', position: '', squadNumber: '' })
  const sortedPlayers = [...players].sort((a, b) => {
    const aHasNumber = typeof a.squadNumber === 'number'
    const bHasNumber = typeof b.squadNumber === 'number'

    if (aHasNumber && bHasNumber && a.squadNumber !== b.squadNumber) {
      return a.squadNumber - b.squadNumber
    }

    if (aHasNumber !== bHasNumber) {
      return aHasNumber ? -1 : 1
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })

  function handleAdd() {
    if (!form.name.trim()) return
    const player = addPlayer({
      name: form.name.trim(),
      position: form.position,
      squadNumber: form.squadNumber ? parseInt(form.squadNumber) : null,
    })
    setPlayers(getPlayers())
    setForm({ name: '', position: '', squadNumber: '' })
    setShowForm(false)
  }

  return (
    <Layout title="Players">
      <div className="px-4 py-4">
        {players.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👕</div>
            <p className="text-gray-500 text-sm">No players yet. Add your squad.</p>
          </div>
        )}

        {players.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {sortedPlayers.map(player => (
              <div key={player.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <span className="text-green-700 font-bold text-sm">
                    {player.squadNumber || '—'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{player.name}</p>
                  <p className="text-sm text-gray-500">{player.position || 'No position'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  player.claimed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {player.claimed ? 'Joined' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Add player</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Player name"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Select position</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Squad number</label>
              <input
                type="number"
                value={form.squadNumber}
                onChange={e => setForm({ ...form, squadNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 7"
                min="1"
                max="99"
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
                disabled={!form.name.trim()}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 active:bg-green-700"
              >
                Add player
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 border-2 border-dashed border-gray-200 text-green-600 rounded-xl font-semibold text-sm active:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add player
          </button>
        )}
      </div>
    </Layout>
  )
}
