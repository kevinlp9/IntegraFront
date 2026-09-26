import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from '@/components/common/Toast'
import { Spinner } from '@/components/common/Spinner'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

const LoginPage = lazy(() => import('@/pages/host/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/host/DashboardPage'))
const RoomDetailPage = lazy(() => import('@/pages/host/RoomDetailPage'))
const ReportsPage = lazy(() => import('@/pages/host/ReportsPage'))
const JoinPage = lazy(() => import('@/pages/participant/JoinPage'))
const PlayPage = lazy(() => import('@/pages/participant/PlayPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner size="lg" className="text-primary-500" />
    </div>
  )
}

/**
 * Mounts the Supabase session listener once at the top of the route tree, so
 * that ProtectedRoute always has a hydrated (or explicitly "not logged in")
 * auth state before deciding whether to redirect — regardless of which page
 * is being rendered.
 */
function AppRoutes() {
  useAuth()

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/join" element={<JoinPage />} />
        <Route path="/join/:code" element={<JoinPage />} />
        <Route path="/play/:code" element={<PlayPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId"
          element={
            <ProtectedRoute>
              <RoomDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId/report"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

/** App root: routing, lazy-loaded pages, TanStack Query (polling) and global toasts. */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
