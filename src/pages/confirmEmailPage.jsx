import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const CONFIRM_URL = "http://localhost:3000/auth/confirm-email"

function ConfirmEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // get email from previous page
  const emailFromState = location.state?.email || ""

  const [email, setEmail] = useState(emailFromState)
  const [otp, setOtp] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!email || !otp) {
      setErrorMessage("Email and OTP are required.")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(CONFIRM_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result?.errMsg || result?.message || "Confirmation failed")
        return
      }

      setSuccessMessage("Email confirmed successfully 🎉")

      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 1200)

    } catch {
      setErrorMessage("Cannot connect to server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <h1>Confirm Email</h1>
      <p className="subtitle">Enter the OTP sent to your email.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label>OTP Code</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />

        {errorMessage && <p className="form-message form-error">{errorMessage}</p>}
        {successMessage && <p className="form-message form-success">{successMessage}</p>}

        <button type="submit" className="btn btn-primary">
          {isSubmitting ? "Verifying..." : "Confirm Email"}
        </button>
      </form>
    </section>
  )
}

export default ConfirmEmailPage