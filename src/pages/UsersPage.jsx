import { useEffect, useState } from 'react'

const REFRESH_URL = 'http://localhost:3000/auth/refresh-Token'
const ALL_USERS_URL = 'http://localhost:3000/admin/get-users'
const DELETE_USER_URL = 'http://localhost:3000/admin/delete-user'

const ROLE_LABELS = { 0: 'Admin', 1: 'User' }
const ROLE_COLORS = {
  0: { bg: '#E6F1FB', color: '#0C447C' },
  1: { bg: '#E1F5EE', color: '#085041' },
}

const CARD_COLORS = [
  { cardBg: '#EAF3DE', avatarBg: '#ec7373', avatarColor: '#27500A' },
  { cardBg: '#E6F1FB', avatarBg: '#B5D4F4', avatarColor: '#0C447C' },
  { cardBg: '#EEEDFE', avatarBg: '#CECBF6', avatarColor: '#3C3489' },
  { cardBg: '#FAEEDA', avatarBg: '#FAC775', avatarColor: '#633806' },
  { cardBg: '#E1F5EE', avatarBg: '#9FE1CB', avatarColor: '#085041' },
]

function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
}

function UserCard({ user, index, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const initials = getInitials(user.firstName, user.lastName)
  const role = ROLE_LABELS[user.role] ?? 'Unknown'
  const roleStyle = ROLE_COLORS[user.role] ?? { bg: '#F1EFE8', color: '#444441' }
  const palette = CARD_COLORS[index % CARD_COLORS.length]

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(user.email)
    setDeleting(false)
    setConfirming(false)
  }

  return (
    <div style={{
      background: palette.cardBg,
      border: '0.5px solid rgba(0,0,0,0.1)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: palette.avatarBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 500, fontSize: 14,
          color: palette.avatarColor,
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.firstName} {user.lastName}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Role + verified badges */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 12, fontWeight: 500, padding: '3px 10px',
          borderRadius: 6, background: roleStyle.bg, color: roleStyle.color,
        }}>
          {role}
        </span>
        <span style={{
          fontSize: 12, padding: '3px 10px', borderRadius: 6,
          background: user.confirmEmail ? '#C0DD97' : '#F0997B',
          color: user.confirmEmail ? '#27500A' : '#993C1D',
        }}>
          {user.confirmEmail ? 'Verified' : 'Unverified'}
        </span>
      </div>

      {/* Delete button / confirm step */}
      {user.role === 0 ? (
        <div style={{
          width: '100%', padding: '6px 0', borderRadius: 6,
          border: '0.5px solid rgba(0,0,0,0.1)', background: 'transparent',
          fontSize: 13, textAlign: 'center', color: '#888',
        }}>
          Cannot delete an admin
        </div>
      ) : confirming ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              flex: 1, padding: '6px 0', borderRadius: 6, border: 'none',
              background: '#E24B4A', color: '#fff', fontWeight: 500,
              fontSize: 13, cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? 'Deleting...' : 'Yes, delete'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            style={{
              flex: 1, padding: '6px 0', borderRadius: 6,
              border: '0.5px solid rgba(0,0,0,0.15)', background: 'transparent',
              fontSize: 13, cursor: 'pointer', color: '#555',
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          style={{
            width: '100%', padding: '6px 0', borderRadius: 6,
            border: '0.5px solid #F09595', background: 'transparent',
            color: '#A32D2D', fontSize: 13, cursor: 'pointer',
          }}
        >
          Delete user
        </button>
      )}
    </div>
  )
}

function UsersPage({ isAdmin }) {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])

  const getAccessToken = () => localStorage.getItem('accessToken')
  const getRefreshToken = () => localStorage.getItem('refreshToken')

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null
    const response = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { Authorization: refreshToken },
    })
    const result = await response.json()
    if (!response.ok || !result?.data?.accessToken) return null
    localStorage.setItem('accessToken', result.data.accessToken)
    return result.data.accessToken
  }

  const authFetch = async (url, options = {}) => {
    let accessToken = getAccessToken()
    let response = await fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${accessToken}`, ...options.headers },
    })
    if ((response.status === 401 || response.status === 403) && getRefreshToken()) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        response = await fetch(url, {
          ...options,
          headers: { Authorization: `Bearer ${newToken}`, ...options.headers },
        })
      }
    }
    return response
  }

  useEffect(() => {
    if (!isAdmin) { setIsLoading(false); return }

    const fetchUsers = async () => {
      const usersRes = await authFetch(ALL_USERS_URL)
      if (usersRes.ok) {
        const usersResult = await usersRes.json()
        setUsers(usersResult?.data?.data?.users || [])
      }
      setIsLoading(false)
    }

    fetchUsers()
  }, [isAdmin])

  const deleteUser = async (email) => {
    const res = await authFetch(DELETE_USER_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.email !== email))
    }
  }

  if (isLoading) {
    return (
      <section className="page">
        <h1>All Users</h1>
        <p className="subtitle">Loading users...</p>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="page">
        <h1>All Users</h1>
        <p className="form-message form-error">This page is for admins only.</p>
      </section>
    )
  }

  return (
    <section className="page">
      <h1>All Users</h1>
      <p className="subtitle">Total: {users.length} users</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
        marginTop: '1.5rem',
      }}>
        {users.map((user, index) => (
          <UserCard key={user._id} user={user} index={index} onDelete={deleteUser} />
        ))}
      </div>
    </section>
  )
}

export default UsersPage