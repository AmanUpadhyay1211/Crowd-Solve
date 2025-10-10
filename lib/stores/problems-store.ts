"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Problem {
  _id: string
  title: string
  description: string
  images: string[]
  tags: string[]
  category?: string
  location?: {
    type: 'Point'
    coordinates: [number, number]
    address?: string
  }
  author: {
    _id: string
    username: string
    avatar?: string
    reputation: number
  }
  status: 'open' | 'solved' | 'closed'
  acceptedSolution?: string
  views: number
  createdAt: string
  updatedAt: string
}

export interface ProblemFilters {
  status?: string
  tag?: string
  search?: string
  category?: string
  page?: number
  limit?: number
}

export interface ProblemsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface ProblemsStore {
  // State
  problems: Problem[]
  currentProblem: Problem | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  pagination: ProblemsPagination | null
  filters: ProblemFilters
  lastFetched: number | null
  
  // Actions
  setProblems: (problems: Problem[]) => void
  setCurrentProblem: (problem: Problem | null) => void
  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
  setError: (error: string | null) => void
  setPagination: (pagination: ProblemsPagination) => void
  setFilters: (filters: Partial<ProblemFilters>) => void
  addProblem: (problem: Problem) => void
  updateProblem: (problemId: string, updates: Partial<Problem>) => void
  removeProblem: (problemId: string) => void
  fetchProblems: (filters?: Partial<ProblemFilters>, forceRefresh?: boolean) => Promise<void>
  fetchProblemById: (id: string) => Promise<void>
  refreshProblems: () => Promise<void>
  clearProblems: () => void
  shouldRefresh: () => boolean
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useProblemsStore = create<ProblemsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      problems: [],
      currentProblem: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
      pagination: null,
      filters: {
        page: 1,
        limit: 10
      },
      lastFetched: null,

      // Actions
      setProblems: (problems) => set({ problems }),
      setCurrentProblem: (problem) => set({ currentProblem: problem }),
      setLoading: (isLoading) => set({ isLoading }),
      setRefreshing: (isRefreshing) => set({ isRefreshing }),
      setError: (error) => set({ error }),
      setPagination: (pagination) => set({ pagination }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      
      addProblem: (problem) => set((state) => ({
        problems: [problem, ...state.problems]
      })),
      
      updateProblem: (problemId, updates) => set((state) => ({
        problems: state.problems.map(problem =>
          problem._id === problemId ? { ...problem, ...updates } : problem
        ),
        currentProblem: state.currentProblem?._id === problemId 
          ? { ...state.currentProblem, ...updates }
          : state.currentProblem
      })),
      
      removeProblem: (problemId) => set((state) => ({
        problems: state.problems.filter(problem => problem._id !== problemId),
        currentProblem: state.currentProblem?._id === problemId ? null : state.currentProblem
      })),
      
      shouldRefresh: () => {
        const { lastFetched } = get()
        return !lastFetched || Date.now() - lastFetched > CACHE_DURATION
      },

      fetchProblems: async (filters = {}, forceRefresh = false) => {
        const state = get()
        
        // Check if we should refresh
        if (!forceRefresh && !state.shouldRefresh() && state.problems.length > 0) {
          return
        }

        try {
          set({ 
            isLoading: true, 
            error: null,
            isRefreshing: state.problems.length > 0 
          })

          const queryParams = new URLSearchParams()
          const currentFilters = { ...state.filters, ...filters }
          
          Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, value.toString())
            }
          })

          const response = await fetch(`/api/problems?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000) // 10 second timeout
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Normalize problems data
          const normalizedProblems = data.problems.map((problem: any) => ({
            ...problem,
            tags: Array.isArray(problem.tags) ? problem.tags : [],
            images: Array.isArray(problem.images) ? problem.images : [],
            author: problem.author || { 
              _id: 'unknown', 
              username: 'Unknown', 
              avatar: null, 
              reputation: 0 
            },
            status: problem.status || 'open',
            views: problem.views || 0
          }))

          set({
            problems: normalizedProblems,
            pagination: data.pagination,
            filters: currentFilters,
            lastFetched: Date.now(),
            isLoading: false,
            isRefreshing: false,
            error: null
          })
        } catch (error: any) {
          console.error('Fetch problems error:', error)
          set({
            error: error.message || 'Failed to fetch problems',
            isLoading: false,
            isRefreshing: false
          })
        }
      },

      fetchProblemById: async (id: string) => {
        try {
          set({ isLoading: true, error: null })

          const response = await fetch(`/api/problems/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Normalize problem data
          const normalizedProblem = {
            ...data.problem,
            tags: Array.isArray(data.problem.tags) ? data.problem.tags : [],
            images: Array.isArray(data.problem.images) ? data.problem.images : [],
            author: data.problem.author || { 
              _id: 'unknown', 
              username: 'Unknown', 
              avatar: null, 
              reputation: 0 
            },
            status: data.problem.status || 'open',
            views: data.problem.views || 0
          }

          set({
            currentProblem: normalizedProblem,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          console.error('Fetch problem error:', error)
          set({
            error: error.message || 'Failed to fetch problem',
            isLoading: false
          })
        }
      },

      refreshProblems: async () => {
        const { fetchProblems, filters } = get()
        await fetchProblems(filters, true)
      },

      clearProblems: () => set({
        problems: [],
        currentProblem: null,
        error: null,
        lastFetched: null
      })
    }),
    {
      name: 'problems-store',
      partialize: (state) => ({
        problems: state.problems,
        filters: state.filters,
        lastFetched: state.lastFetched
      })
    }
  )
)
