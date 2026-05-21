import { reactive } from 'vue'
import {
  users as seedUsers,
  clubs as seedClubs,
  activities as seedActivities,
  applications as seedApplications,
  members as seedMembers,
  signups as seedSignups,
  quitApplications as seedQuitApplications,
  dashboardData as seedDashboardData
} from './data'

const STORAGE_KEY = 'shishan_mock_store'

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Ignore corrupted localStorage and fall back to seed data.
  }

  return {
    ...createSeedStore()
  }
}

const state = reactive(loadStore())

function createSeedStore() {
  return {
    users: clone(seedUsers),
    clubs: clone(seedClubs),
    activities: clone(seedActivities),
    applications: clone(seedApplications),
    members: clone(seedMembers),
    signups: clone(seedSignups),
    quitApplications: clone(seedQuitApplications),
    dashboardData: clone(seedDashboardData)
  }
}

export const users = state.users
export const clubs = state.clubs
export const activities = state.activities
export const applications = state.applications
export const members = state.members
export const signups = state.signups
export const quitApplications = state.quitApplications
export const dashboardData = state.dashboardData

export function saveMockStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clone(state)))
}

export function resetMockStore() {
  const fresh = createSeedStore()
  Object.assign(state.users, fresh.users)
  state.clubs.splice(0, state.clubs.length, ...fresh.clubs)
  state.activities.splice(0, state.activities.length, ...fresh.activities)
  state.applications.splice(0, state.applications.length, ...fresh.applications)
  state.members.splice(0, state.members.length, ...fresh.members)
  state.signups.splice(0, state.signups.length, ...fresh.signups)
  state.quitApplications.splice(0, state.quitApplications.length, ...fresh.quitApplications)
  Object.assign(state.dashboardData, fresh.dashboardData)
  saveMockStore()
}
