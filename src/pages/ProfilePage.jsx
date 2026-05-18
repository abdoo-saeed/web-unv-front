import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROFILE_URL = 'http://localhost:3000/auth/profile'
const REFRESH_URL = 'http://localhost:3000/auth/refresh-Token'
const PROFILE_IMAGE_URL = 'http://localhost:3000/users/user-profile'
const API_BASE_URL = 'http://localhost:3000'

function ProfilePage({ onUnauthorized }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return null

    const refreshResponse = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: {
        Authorization: refreshToken,
      },
    })

    const refreshResult = await refreshResponse.json()
    if (!refreshResponse.ok) return null

    const newAccessToken = refreshResult?.data?.accessToken
    if (!newAccessToken) return null

    localStorage.setItem('accessToken', newAccessToken)
    return newAccessToken
  }

  const authorizedFetch = async (url, options = {}) => {
    const refreshToken = localStorage.getItem('refreshToken')
    let accessToken = localStorage.getItem('accessToken')

    if (!accessToken && refreshToken) {
      accessToken = await refreshAccessToken()
    }

    if (!accessToken) {
      return { unauthorized: true }
    }

    const requestWithToken = (token) =>
      fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      })

    let response = await requestWithToken(accessToken)

    if ((response.status === 401 || response.status === 403) && refreshToken) {
      const newAccessToken = await refreshAccessToken()
      if (!newAccessToken) {
        return { unauthorized: true }
      }
      response = await requestWithToken(newAccessToken)
    }

    return { response, unauthorized: response.status === 401 || response.status === 403 }
  }

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (!localStorage.getItem('accessToken') && !localStorage.getItem('refreshToken')) {
        onUnauthorized?.()
        navigate('/login', { replace: true })
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')
        const { response, unauthorized } = await authorizedFetch(PROFILE_URL, {
          method: 'GET',
        })

        if (unauthorized || !response) {
          onUnauthorized?.()
          navigate('/login', { replace: true })
          return
        }

        const result = await response.json()

        if (!response.ok) {
          if (isMounted) {
            setErrorMessage(result?.errMsg || result?.message || 'Failed to load profile.')
          }
          return
        }

        if (isMounted) {
          setProfile(result?.data || null)
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Cannot connect to backend. Make sure your API server is running.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [navigate, onUnauthorized])

  const handleImageUpload = async (event) => {
    event.preventDefault()
    setUploadMessage('')

    if (!selectedImage) {
      setUploadMessage('Please choose an image first.')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('image', selectedImage)

      const { response } = await authorizedFetch(PROFILE_IMAGE_URL, {
        method: 'PATCH',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setUploadMessage(result?.errMsg || result?.message || 'Upload failed.')
        return
      }

      setUploadMessage('Profile image uploaded successfully.')

      const refreshed = await authorizedFetch(PROFILE_URL, { method: 'GET' })
      if (refreshed.response?.ok) {
        const data = await refreshed.response.json()
        setProfile(data?.data || profile)
      }

      setSelectedImage(null)
      setPreviewUrl('')
    } catch {
      setUploadMessage('Cannot connect to backend.')
    } finally {
      setIsUploading(false)
    }
  }

  // ✅ ONLY ADDITION: DELETE IMAGE FUNCTION
  const handleDeleteImage = async () => {
    try {
      setUploadMessage('')

      const { response } = await authorizedFetch(
        `${API_BASE_URL}/users/del-user-profile`,
        {
          method: 'DELETE',
        }
      )

      const result = await response.json()

      if (!response.ok) {
        setUploadMessage(result?.errMsg || result?.message || 'Delete failed.')
        return
      }

      setUploadMessage('Profile image deleted successfully.')

      const refreshedProfile = await authorizedFetch(PROFILE_URL, {
        method: 'GET',
      })

      if (refreshedProfile.response?.ok) {
        const refreshedResult = await refreshedProfile.response.json()
        setProfile(refreshedResult?.data || profile)
      }

      setPreviewUrl('')
      setSelectedImage(null)
    } catch {
      setUploadMessage('Cannot connect to backend.')
    }
  }

  if (isLoading) {
    return (
      <section className="page profile-page">
        <h1>Profile</h1>
        <p className="subtitle">Loading profile data...</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="page profile-page">
        <h1>Profile</h1>
        <p className="form-message form-error">{errorMessage}</p>
      </section>
    )
  }

  const username = profile?.username || 'Unknown User'

  const initials = username
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('')

  const genderLabel = String(profile?.gender) === '0' ? 'Male' : 'Female'

  const roleLabel =
    String(profile?.role) === '0'
      ? 'Admin'
      : String(profile?.role) === '1'
        ? 'User'
        : 'N/A'

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : 'N/A'

  const rawProfileImagePath = profile?.profileImage || ''
  const normalizedImagePath = rawProfileImagePath
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')

  const profileImageSrc = rawProfileImagePath.startsWith('http')
    ? rawProfileImagePath
    : normalizedImagePath
      ? `${API_BASE_URL}/${normalizedImagePath}`
      : ''

  const activeProfileImage = previewUrl || profileImageSrc

  return (
    <section className="page profile-page">
      <h1>Profile</h1>
      <p className="subtitle">
        Manage your account details and profile photo from one place.
      </p>

      <section className="profile-stats-grid">
        <article className="stat-card">
          <p className="muted">Account status</p>
          <h3>{profile?.confirmEmail ? 'Verified' : 'Pending verification'}</h3>
        </article>

        <article className="stat-card">
          <p className="muted">Joined</p>
          <h3>{joinDate}</h3>
        </article>

        <article className="stat-card">
          <p className="muted">Role</p>
          <h3>{roleLabel}</h3>
        </article>
      </section>

      <article className="profile-card">
        {activeProfileImage ? (
          <img src={activeProfileImage} alt="profile" className="profile-image" />
        ) : (
          <div className="avatar">{initials || 'U'}</div>
        )}

        <div>
          <h2>{username}</h2>
          <p>{profile?.email || 'No email available'}</p>
          <p className="muted">User ID: {profile?.id || profile?._id || 'N/A'}</p>
        </div>
      </article>

      <article className="profile-details profile-meta-grid">
        <p><strong>Age:</strong> {profile?.age ?? 'N/A'}</p>
        <p><strong>Gender:</strong> {genderLabel}</p>
        <p><strong>Role:</strong> {roleLabel}</p>
        <p><strong>Email Confirmed:</strong> {profile?.confirmEmail ? 'Yes' : 'No'}</p>
      </article>

      <article className="profile-details">
        <h3>Profile Image</h3>

        <form className="upload-form" onSubmit={handleImageUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] || null
              setSelectedImage(file)
              setPreviewUrl(file ? URL.createObjectURL(file) : '')
            }}
          />

          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>

          {/* ✅ ONLY ADDED BUTTON */}
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteImage}
          >
            Delete Image
          </button>
        </form>

        {selectedImage && <p className="muted">Selected: {selectedImage.name}</p>}
        {uploadMessage && (
          <p className="form-message">{uploadMessage}</p>
        )}
      </article>
    </section>
  )
}

export default ProfilePage