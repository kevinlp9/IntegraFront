import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from '@/components/common/Toast'
import { Spinner } from '@/components/common/Spinner'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AlumnoProtectedRoute } from '@/components/layout/AlumnoProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/host/DashboardPage'))
const GruposPage = lazy(() => import('@/pages/host/GruposPage'))
const GrupoDetailPage = lazy(() => import('@/pages/host/GrupoDetailPage'))
const RoomDetailPage = lazy(() => import('@/pages/host/RoomDetailPage'))
const ReportsPage = lazy(() => import('@/pages/host/ReportsPage'))
const AccountPage = lazy(() => import('@/pages/host/AccountPage'))
const JoinPage = lazy(() => import('@/pages/participant/JoinPage'))
const PlayPage = lazy(() => import('@/pages/participant/PlayPage'))
const StudentHistoryPage = lazy(
  () => import('@/pages/participant/StudentHistoryPage'),
)
const AlumnoAccountPage = lazy(
  () => import('@/pages/participant/AlumnoAccountPage'),
)

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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/alumno/login" element={<Navigate to="/login" replace />} />
        <Route path="/alumno/register" element={<Navigate to="/register" replace />} />

        <Route
          path="/join"
          element={
            <AlumnoProtectedRoute>
              <JoinPage />
            </AlumnoProtectedRoute>
          }
        />
        <Route
          path="/join/:code"
          element={
            <AlumnoProtectedRoute>
              <JoinPage />
            </AlumnoProtectedRoute>
          }
        />
        <Route
          path="/play/:code"
          element={
            <AlumnoProtectedRoute>
              <PlayPage />
            </AlumnoProtectedRoute>
          }
        />
        <Route
          path="/grupos/:grupoId/historial"
          element={
            <AlumnoProtectedRoute>
              <StudentHistoryPage />
            </AlumnoProtectedRoute>
          }
        />
        <Route
          path="/mi-cuenta"
          element={
            <AlumnoProtectedRoute>
              <AlumnoAccountPage />
            </AlumnoProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuenta"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grupos"
          element={
            <ProtectedRoute>
              <GruposPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grupos/:grupoId"
          element={
            <ProtectedRoute>
              <GrupoDetailPage />
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

        <Route path="*" element={<Navigate to="/" replace />} />
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
