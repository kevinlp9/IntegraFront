import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from '@/components/common/Toast'
import { Spinner } from '@/components/common/Spinner'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const DashboardPage = lazy(() => import('@/pages/teacher/DashboardPage'))
const RoomDetailPage = lazy(() => import('@/pages/teacher/RoomDetailPage'))
const ReportsPage = lazy(() => import('@/pages/teacher/ReportsPage'))
const EvaluationPage = lazy(() => import('@/pages/student/EvaluationPage'))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" className="text-primary-600" />
    </div>
  )
}

/** App root: sets up client-side routing, lazy-loaded pages and global toasts. */
function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/join" element={<EvaluationPage />} />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/rooms/:roomId"
            element={
              <ProtectedRoute role="teacher">
                <RoomDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/rooms/:roomId/reports"
            element={
              <ProtectedRoute role="teacher">
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
