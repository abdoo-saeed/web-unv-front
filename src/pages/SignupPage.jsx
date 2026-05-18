import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SIGNUP_URL = 'http://localhost:3000/auth/signUp'
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!_%^&*])(?=.*[0-9])(?!.*\s).{8,}$/
const PHONE_REGEX = /^0?1[0125]\d{8}$/

function SignupPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('0')
  const [phone, setPhone] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const normalizedUsername = username.trim()

    if (!normalizedUsername || !email || !password || !repeatPassword || !age || !phone) {
      return 'Please fill in all required fields.'
    }

    const usernameParts = normalizedUsername.split(' ').filter(Boolean)
    if (normalizedUsername.length < 10 || normalizedUsername.length > 30 || usernameParts.length < 2) {
      return 'Username must be 10-30 chars and contain first and last name separated by space.'
    }

    if (!PASSWORD_REGEX.test(password)) {
      return 'Password must be 8+ chars with upper, lower, number, and special symbol.'
    }

    if (password !== repeatPassword) {
      return 'Password and repeat password do not match.'
    }

    const ageNumber = Number(age)
    if (!Number.isFinite(ageNumber) || ageNumber < 12 || ageNumber > 100) {
      return 'Age must be between 12 and 100.'
    }

    if (!PHONE_REGEX.test(phone)) {
      return 'Phone must be a valid Egyptian mobile number.'
    }

    return ''
  }



  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email,
          password,
          age: Number(age),
          gender: Number(gender),
          phone,
          repeatPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result?.errMsg || result?.message || 'Signup failed. Please try again.')
        return
      }

      setSuccessMessage('Account created successfully. Redirecting to login...')
      setTimeout(() => {
        navigate('/confirm-email', { 
           replace: true,
           state: { email }
        })
      }, 1000)
    } catch {
      setErrorMessage('Cannot connect to backend. Make sure your API server is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <h1>Signup</h1>
      <p className="subtitle">Create your account in Saraha App.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="signup-name">Username</label>
        <input
          id="signup-name"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="sayed saeed"
          minLength={10}
          maxLength={30}
        />
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create password"
          minLength={8}
        />
        <label htmlFor="signup-repeat-password">Repeat Password</label>
        <input
          id="signup-repeat-password"
          type="password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          placeholder="Repeat password"
        />
        <label htmlFor="signup-age">Age</label>
        <input
          id="signup-age"
          type="number"
          min="12"
          max="100"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          placeholder="21"
        />
        <label htmlFor="signup-gender">Gender</label>
        <select
          id="signup-gender"
          value={gender}
          onChange={(event) => setGender(event.target.value)}
        >
          <option value="0">Male (0)</option>
          <option value="1">Female (1)</option>
        </select>
        <label htmlFor="signup-phone">Phone</label>
        <input
          id="signup-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="01132984182"
          minLength={10}
          maxLength={11}
        />
        {errorMessage && <p className="form-message form-error">{errorMessage}</p>}
        {successMessage && <p className="form-message form-success">{successMessage}</p>}
        <button type="submit" className="btn btn-primary">
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default SignupPage
