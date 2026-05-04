import { v4 as uuid } from 'uuid'

const KEYS = {
  club: 'baggies_club',
  players: 'baggies_players',
  matches: 'baggies_matches',
  currentUser: 'baggies_current_user',
}

function read(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getClub() {
  return read(KEYS.club, { name: '', badge: null, inviteCode: uuid().slice(0, 8) })
}

export function saveClub(club) {
  write(KEYS.club, club)
}

export function getPlayers() {
  return read(KEYS.players, [])
}

export function savePlayers(players) {
  write(KEYS.players, players)
}

export function addPlayer(player) {
  const players = getPlayers()
  const newPlayer = { id: uuid(), claimed: false, claimedByName: null, ...player }
  savePlayers([...players, newPlayer])
  return newPlayer
}

export function claimPlayer(playerId, name) {
  const players = getPlayers()
  const updated = players.map(p =>
    p.id === playerId ? { ...p, claimed: true, claimedByName: name } : p
  )
  savePlayers(updated)
}

export function getMatches() {
  return read(KEYS.matches, [])
}

export function saveMatches(matches) {
  write(KEYS.matches, matches)
}

export function addMatch(match) {
  const matches = getMatches()
  const newMatch = { id: uuid(), availability: {}, teamSheet: null, ...match }
  saveMatches([...matches, newMatch])
  return newMatch
}

export function setAvailability(matchId, playerId, status) {
  const matches = getMatches()
  const updated = matches.map(m =>
    m.id === matchId
      ? { ...m, availability: { ...m.availability, [playerId]: status } }
      : m
  )
  saveMatches(updated)
}

export function publishTeamSheet(matchId, playerIds) {
  const matches = getMatches()
  const updated = matches.map(m =>
    m.id === matchId ? { ...m, teamSheet: { published: true, playerIds } } : m
  )
  saveMatches(updated)
}

export function getCurrentUser() {
  return read(KEYS.currentUser, null)
}

export function setCurrentUser(user) {
  write(KEYS.currentUser, user)
}

export function clearCurrentUser() {
  localStorage.removeItem(KEYS.currentUser)
}

export function resetAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
