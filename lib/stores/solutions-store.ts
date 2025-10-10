"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Solution {
  _id: string
  content: string
  images: string[]
  author: {
    _id: string
    username: string
    avatar?: string
    reputation: number
  }
  problem: string | {
    _id: string
    title: string
    description: string
    status: string
  }
  upvotes: number
  downvotes: number
  votes: number // Keep for backward compatibility
  isAccepted: boolean
  createdAt: string
  updatedAt: string
}

export interface Vote {
  _id: string
  user: string
  solution: string
  voteType: 'upvote' | 'downvote'
  createdAt: string
}

interface SolutionsStore {
  // State
  solutions: Solution[]
  currentSolution: Solution | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  lastFetched: number | null
  userVotes: Record<string, 'upvote' | 'downvote'> // solutionId -> voteType
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  filters: {
    sortBy?: 'votes' | 'createdAt' | 'upvotes'
    order?: 'asc' | 'desc'
    status?: 'accepted' | 'pending'
    page?: number
    limit?: number
  }
  
  // Actions
  setSolutions: (solutions: Solution[]) => void
  setCurrentSolution: (solution: Solution | null) => void
  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
  setError: (error: string | null) => void
  setPagination: (pagination: SolutionsStore['pagination']) => void
  setFilters: (filters: Partial<SolutionsStore['filters']>) => void
  addSolution: (solution: Solution) => void
  updateSolution: (solutionId: string, updates: Partial<Solution>) => void
  removeSolution: (solutionId: string) => void
  fetchSolutions: (problemId: string, filters?: Partial<SolutionsStore['filters']>, forceRefresh?: boolean) => Promise<void>
  fetchAllSolutions: (filters?: Partial<SolutionsStore['filters']>, forceRefresh?: boolean) => Promise<void>
  fetchSolutionById: (id: string) => Promise<void>
  voteSolution: (solutionId: string, voteType: 'upvote' | 'downvote') => Promise<void>
  acceptSolution: (solutionId: string) => Promise<void>
  refreshSolutions: (problemId: string) => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  clearSolutions: () => void
  shouldRefresh: () => boolean
}

const CACHE_DURATION = 3 * 60 * 1000 // 3 minutes

export const useSolutionsStore = create<SolutionsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      solutions: [],
      currentSolution: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
      lastFetched: null,
      userVotes: {},
      pagination: null,
      filters: {
        sortBy: 'votes',
        order: 'desc',
        page: 1,
        limit: 10
      },

      // Actions
      setSolutions: (solutions) => set({ solutions }),
      setCurrentSolution: (solution) => set({ currentSolution: solution }),
      setLoading: (isLoading) => set({ isLoading }),
      setRefreshing: (isRefreshing) => set({ isRefreshing }),
      setError: (error) => set({ error }),
      setPagination: (pagination) => set({ pagination }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      
      addSolution: (solution) => set((state) => ({
        solutions: [solution, ...state.solutions]
      })),
      
      updateSolution: (solutionId, updates) => set((state) => ({
        solutions: state.solutions.map(solution =>
          solution._id === solutionId ? { ...solution, ...updates } : solution
        ),
        currentSolution: state.currentSolution?._id === solutionId 
          ? { ...state.currentSolution, ...updates }
          : state.currentSolution
      })),
      
      removeSolution: (solutionId) => set((state) => ({
        solutions: state.solutions.filter(solution => solution._id !== solutionId),
        currentSolution: state.currentSolution?._id === solutionId ? null : state.currentSolution
      })),
      
      shouldRefresh: () => {
        const { lastFetched } = get()
        return !lastFetched || Date.now() - lastFetched > CACHE_DURATION
      },

      fetchSolutions: async (problemId: string, forceRefresh = false) => {
        const state = get()
        
        // Check if we should refresh
        if (!forceRefresh && !state.shouldRefresh() && state.solutions.length > 0) {
          return
        }

        try {
          set({ 
            isLoading: true, 
            error: null,
            isRefreshing: state.solutions.length > 0 
          })

          const response = await fetch(`/api/problems/${problemId}/solutions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Normalize solutions data
          const normalizedSolutions = data.solutions.map((solution: any) => ({
            ...solution,
            images: Array.isArray(solution.images) ? solution.images : [],
            author: solution.author || { 
              _id: 'unknown', 
              username: 'Unknown', 
              avatar: null, 
              reputation: 0 
            },
            upvotes: solution.upvotes || 0,
            downvotes: solution.downvotes || 0,
            votes: solution.votes || solution.upvotes || 0, // Fallback to upvotes if votes not available
            isAccepted: solution.isAccepted || false
          }))

          set({
            solutions: normalizedSolutions,
            lastFetched: Date.now(),
            isLoading: false,
            isRefreshing: false,
            error: null
          })
        } catch (error: any) {
          console.error('Fetch solutions error:', error)
          set({
            error: error.message || 'Failed to fetch solutions',
            isLoading: false,
            isRefreshing: false
          })
        }
      },

      fetchAllSolutions: async (filters = {}, forceRefresh = false) => {
        const state = get()
        
        // Check if we should refresh
        if (!forceRefresh && !state.shouldRefresh() && state.solutions.length > 0) {
          return
        }

        try {
          set({ 
            isLoading: true, 
            error: null,
            isRefreshing: state.solutions.length > 0 
          })

          // Build query parameters
          const queryParams = new URLSearchParams()
          const mergedFilters = { ...state.filters, ...filters }
          
          if (mergedFilters.sortBy) queryParams.append('sortBy', mergedFilters.sortBy)
          if (mergedFilters.order) queryParams.append('order', mergedFilters.order)
          if (mergedFilters.status) queryParams.append('status', mergedFilters.status)
          if (mergedFilters.page) queryParams.append('page', mergedFilters.page.toString())
          if (mergedFilters.limit) queryParams.append('limit', mergedFilters.limit.toString())

          const response = await fetch(`/api/solutions?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Normalize solutions data
          const normalizedSolutions = data.solutions.map((solution: any) => ({
            ...solution,
            images: Array.isArray(solution.images) ? solution.images : [],
            author: solution.author || { 
              _id: 'unknown', 
              username: 'Unknown', 
              avatar: null, 
              reputation: 0 
            },
            problem: solution.problem || { 
              _id: 'unknown', 
              title: 'Unknown Problem', 
              description: '', 
              status: 'pending' 
            },
            upvotes: solution.upvotes || 0,
            downvotes: solution.downvotes || 0,
            votes: solution.votes || solution.upvotes || 0,
            isAccepted: solution.isAccepted || false
          }))

          set({
            solutions: normalizedSolutions,
            pagination: data.pagination || null,
            lastFetched: Date.now(),
            isLoading: false,
            isRefreshing: false,
            error: null
          })
        } catch (error: any) {
          console.error('Fetch all solutions error:', error)
          set({
            error: error.message || 'Failed to fetch solutions',
            isLoading: false,
            isRefreshing: false
          })
        }
      },

      fetchSolutionById: async (id: string) => {
        try {
          set({ isLoading: true, error: null })

          const response = await fetch(`/api/solutions/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Normalize solution data
          const normalizedSolution = {
            ...data.solution,
            images: Array.isArray(data.solution.images) ? data.solution.images : [],
            author: data.solution.author || { 
              _id: 'unknown', 
              username: 'Unknown', 
              avatar: null, 
              reputation: 0 
            },
            upvotes: data.solution.upvotes || 0,
            downvotes: data.solution.downvotes || 0,
            votes: data.solution.votes || data.solution.upvotes || 0,
            isAccepted: data.solution.isAccepted || false
          }

          set({
            currentSolution: normalizedSolution,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          console.error('Fetch solution error:', error)
          set({
            error: error.message || 'Failed to fetch solution',
            isLoading: false
          })
        }
      },

      voteSolution: async (solutionId: string, voteType: 'upvote' | 'downvote') => {
        try {
          const response = await fetch(`/api/solutions/${solutionId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voteType })
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Update solution votes
          set((state) => ({
            solutions: state.solutions.map(solution =>
              solution._id === solutionId 
                ? { ...solution, votes: data.votes }
                : solution
            ),
            currentSolution: state.currentSolution?._id === solutionId 
              ? { ...state.currentSolution, votes: data.votes }
              : state.currentSolution,
            userVotes: {
              ...state.userVotes,
              [solutionId]: voteType
            }
          }))
        } catch (error: any) {
          console.error('Vote solution error:', error)
          set({ error: error.message || 'Failed to vote on solution' })
        }
      },

      acceptSolution: async (solutionId: string) => {
        try {
          const response = await fetch(`/api/solutions/${solutionId}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          // Update solution as accepted
          set((state) => ({
            solutions: state.solutions.map(solution =>
              solution._id === solutionId 
                ? { ...solution, isAccepted: true }
                : { ...solution, isAccepted: false } // Only one solution can be accepted
            ),
            currentSolution: state.currentSolution?._id === solutionId 
              ? { ...state.currentSolution, isAccepted: true }
              : state.currentSolution
          }))
        } catch (error: any) {
          console.error('Accept solution error:', error)
          set({ error: error.message || 'Failed to accept solution' })
        }
      },

      refreshSolutions: async (problemId: string) => {
        const { fetchSolutions } = get()
        await fetchSolutions(problemId, true)
      },

      goToPage: async (page: number) => {
        const { fetchAllSolutions, filters, pagination } = get()
        if (pagination && page >= 1 && page <= pagination.pages) {
          await fetchAllSolutions({ ...filters, page }, true)
        }
      },

      nextPage: async () => {
        const { pagination, goToPage } = get()
        if (pagination && pagination.page < pagination.pages) {
          await goToPage(pagination.page + 1)
        }
      },

      previousPage: async () => {
        const { pagination, goToPage } = get()
        if (pagination && pagination.page > 1) {
          await goToPage(pagination.page - 1)
        }
      },

      clearSolutions: () => set({
        solutions: [],
        currentSolution: null,
        error: null,
        lastFetched: null,
        userVotes: {}
      })
    }),
    {
      name: 'solutions-store',
      partialize: (state) => ({
        solutions: state.solutions,
        userVotes: state.userVotes,
        lastFetched: state.lastFetched
      })
    }
  )
)
