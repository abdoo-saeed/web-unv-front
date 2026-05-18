import { useState } from 'react'
import { Link } from 'react-router-dom'

const LOGIN_URL = 'http://localhost:3000/auth/login'

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Email and password are required.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result?.errMsg || result?.message || 'Login failed. Please try again.')
        return
      }

      const accessToken = result?.data?.accessToken
      const refreshToken = result?.data?.refreshToken

      if (!accessToken) {
        setErrorMessage('Login response did not contain an access token.')
        return
      }
     
      onLogin({ accessToken, refreshToken })
    } catch {
      setErrorMessage('Cannot connect to backend. Make sure your API server is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <h1>Login</h1>
      <p className="subtitle">Login to access your profile page.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          minLength={8}
        />
        {errorMessage && <p className="form-message form-error">{errorMessage}</p>}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="muted">
        No account yet? <Link to="/signup">Create one</Link>
      </p>
    </section>
  )
}

export default LoginPage


