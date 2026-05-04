import { useState, useRef } from 'react'
import { getClub, saveClub, resetAll } from '../../store'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function MyClub() {
  const navigate = useNavigate()
  const [club, setClub] = useState(getClub)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef()

  const joinLink = `${window.location.origin}/join`

  function handleSave() {
    saveClub(club)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleBadge(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const updated = { ...club, badge: ev.target.result }
      setClub(updated)
      saveClub(updated)
    }
    reader.readAsDataURL(file)
  }

  function copyLink() {
    navigator.clipboard.writeText(joinLink)
      .then(() => alert('Link copied!'))
      .catch(() => alert(joinLink))
  }

  function handleReset() {
    if (confirm('Reset all prototype data? This cannot be undone.')) {
      resetAll()
      navigate('/')
    }
  }

  return (
    <Layout title="My Club">
      <div className="px-4 py-6 flex flex-col gap-6">

        {/* Badge */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => fileRef.current.click()}
            className="relative group"
          >
            {club.badge ? (
              <img src={club.badge} alt="Club badge" className="w-24 h-24 object-contain rounded-full border-2 border-gray-200" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">B</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </button>
          <p className="text-sm text-gray-500">Tap to upload club badge</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBadge} />
        </div>

        {/* Club name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Club name</label>
          <input
            type="text"
            value={club.name}
            onChange={e => setClub({ ...club, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. Mt. Albert Ponsonby Baggies"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-base active:bg-green-700 transition-colors"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>

        {/* Player invite link */}
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Player invite link</p>
          <p className="text-xs text-gray-500 mb-3">Share this with players so they can join the squad.</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-3">
            <span className="text-xs text-gray-600 flex-1 truncate">{joinLink}</span>
          </div>
          <button
            onClick={copyLink}
            className="w-full py-3 border border-green-600 text-green-600 rounded-xl font-semibold text-sm active:bg-green-50 transition-colors"
          >
            Copy link
          </button>
        </div>

        {/* Reset */}
        <div className="border border-red-100 rounded-xl p-4">
          <p className="text-sm font-medium text-red-700 mb-1">Reset prototype data</p>
          <p className="text-xs text-gray-500 mb-3">Clears all players, matches, and settings. Use during testing only.</p>
          <button
            onClick={handleReset}
            className="w-full py-3 border border-red-300 text-red-600 rounded-xl font-semibold text-sm active:bg-red-50 transition-colors"
          >
            Reset all data
          </button>
        </div>

      </div>
    </Layout>
  )
}
