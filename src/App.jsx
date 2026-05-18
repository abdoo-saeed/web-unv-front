import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SendMessagePage from './pages/SendMessagePage'
import GetMessagePage from './pages/GetMessagePage'
import UsersPage from './pages/UsersPage'
import AdminSearchUsersPage from './pages/AdminSearchUsersPage'
import ConfirmEmailPage from './pages/confirmEmailPage'
import { getClaimsFromAccessToken, isAdminFromClaims } from './utils/authToken'
import './App.css'

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')),
  )
  const [isAdmin, setIsAdmin] = useState(() => {
    const claims = getClaimsFromAccessToken(localStorage.getItem('accessToken'))
    return isAdminFromClaims(claims)
  })
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const authActions = useMemo(
    () => ({
      login({ accessToken, refreshToken }) {
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
        } else {
          localStorage.removeItem('accessToken')
        }

        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        } else {
          localStorage.removeItem('refreshToken')
        }

        setIsAuthenticated(true)

        const claims = getClaimsFromAccessToken(accessToken)
        setIsAdmin(isAdminFromClaims(claims))
      },
      logout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setIsAuthenticated(false)
        setIsAdmin(false)
      },
    }),
    [],
  )

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false)
      return
    }

    const claims = getClaimsFromAccessToken(localStorage.getItem('accessToken'))
    setIsAdmin(isAdminFromClaims(claims))
  }, [isAuthenticated])

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken')
    setIsLoggingOut(true)

    try {
      if (accessToken) {
        await fetch('http://localhost:3000/auth/logout', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
    } catch {
      // ignore errors
    } finally {
      authActions.logout()
      setIsLoggingOut(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="app-layout">
      <Navbar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/send-message"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SendMessagePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/get-message"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <GetMessagePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UsersPage isAdmin={isAdmin} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/search-users"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminSearchUsersPage isAdmin={isAdmin} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage onUnauthorized={authActions.logout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/profile" replace />
                : <LoginPage onLogin={authActions.login} />
            }
          />

          <Route
            path="/signup"
            element={
              isAuthenticated
                ? <Navigate to="/profile" replace />
                : <SignupPage />
            }
          />

          <Route path="/confirm-email" element={<ConfirmEmailPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App