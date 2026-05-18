import { useEffect, useMemo, useRef, useState } from 'react'

const REFRESH_URL = 'http://localhost:3000/auth/refresh-Token'
const SEARCH_USERS_URL = 'http://localhost:3000/admin/search-users'

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

function AdminSearchUsersPage({ isAdmin }) {
  const [firstName, setFirstName] = useState('')
  const debouncedFirstName = useDebouncedValue(firstName, 350)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const requestSeq = useRef(0)

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

  const authFetch = useMemo(() => {
    return async (url, options = {}) => {
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
  }, [])

  const totalPages = Math.max(1, Math.ceil(Number(total || 0) / Number(limit || 1)))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [debouncedFirstName, limit])

  useEffect(() => {
    if (!isAdmin) return

    const q = debouncedFirstName.trim()
    if (!q) {
      setUsers([])
      setTotal(0)
      setErrorMessage('')
      setIsLoading(false)
      return
    }

    let didCancel = false
    const seq = ++requestSeq.current

    const run = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const params = new URLSearchParams({
          firstName: q,
          page: String(page),
          limit: String(limit),
        })

        const res = await authFetch(`${SEARCH_USERS_URL}?${params.toString()}`)
        const result = await res.json().catch(() => ({}))

        if (didCancel || seq !== requestSeq.current) return

        if (!res.ok) {
          setUsers([])
          setTotal(0)
          setErrorMessage(result?.errMsg || result?.message || 'Search failed.')
          return
        }

        const payload = result?.data?.data || result?.data
        setUsers(payload?.users || [])
        setTotal(Number(payload?.total || 0))
      } catch {
        if (didCancel || seq !== requestSeq.current) return
        setErrorMessage('Cannot connect to backend. Make sure your API server is running.')
      } finally {
        if (didCancel || seq !== requestSeq.current) return
        setIsLoading(false)
      }
    }

    run()
    return () => {
      didCancel = true
    }
  }, [authFetch, debouncedFirstName, isAdmin, limit, page])

  if (!isAdmin) {
    return (
      <section className="page">
        <h1>Search Users</h1>
        <p className="form-message form-error">This page is for admins only.</p>
      </section>
    )
  }

  return (
    <section className="page">
      <h1>Search Users</h1>
      <p className="subtitle">Search by first name. Results are admin-only.</p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: 10, maxWidth: 640 }}>
        <label htmlFor="admin-search-firstname" style={{ fontWeight: 600, color: '#f3f4f6' }}>
          First name
        </label>
        <input
          id="admin-search-firstname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="e.g. Mohamed"
          style={{
            border: '1px solid #3f3f46',
            background: '#0f0f0f',
            color: '#f3f4f6',
            borderRadius: '0.6rem',
            padding: '0.6rem 0.75rem',
            font: 'inherit',
          }}
        />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="muted">
            {debouncedFirstName.trim()
              ? (isLoading ? 'Searching…' : `Found: ${total}`)
              : 'Type a name to start searching.'}
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <label htmlFor="admin-search-limit" className="muted">Per page</label>
            <select
              id="admin-search-limit"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              style={{
                border: '1px solid #3f3f46',
                background: '#0f0f0f',
                color: '#f3f4f6',
                borderRadius: '0.6rem',
                padding: '0.45rem 0.6rem',
                font: 'inherit',
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="form-message form-error" style={{ marginTop: 12 }}>
          {errorMessage}
        </p>
      )}

      {!!debouncedFirstName.trim() && !errorMessage && !isLoading && (
        <p className="muted" style={{ marginTop: 12 }}>
          Page {page} of {totalPages}
        </p>
      )}

      <div style={{
        marginTop: '1rem',
        background: '#171717',
        border: '1px solid #2b2b2b',
        borderRadius: '1rem',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.1fr 1.6fr 0.8fr 0.9fr',
          gap: 12,
          padding: '12px 14px',
          borderBottom: '1px solid #2b2b2b',
          color: '#e5e7eb',
          fontWeight: 700,
          fontSize: 13,
        }}>
          <div>First</div>
          <div>Last</div>
          <div>Email</div>
          <div>Role</div>
          <div>Verified</div>
        </div>

        {users.length === 0 ? (
          <div style={{ padding: '14px', color: '#d1d5db' }}>
            {debouncedFirstName.trim()
              ? (isLoading ? 'Loading…' : 'No users to show.')
              : 'Start typing to search.'}
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id || u.email}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1.1fr 1.6fr 0.8fr 0.9fr',
                gap: 12,
                padding: '12px 14px',
                borderBottom: '1px solid #242424',
                color: '#f3f4f6',
                fontSize: 13,
                alignItems: 'center',
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.firstName || '-'}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.lastName || '-'}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email || '-'}</div>
              <div>{String(u.role) === '0' ? 'Admin' : 'User'}</div>
              <div>{u.confirmEmail ? 'Yes' : 'No'}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
        <button
          type="button"
          className={`btn btn-secondary ${page <= 1 || isLoading ? 'btn-disabled' : ''}`}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || isLoading || !debouncedFirstName.trim()}
        >
          Previous
        </button>
        <button
          type="button"
          className={`btn btn-primary ${page >= totalPages || isLoading ? 'btn-disabled' : ''}`}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || isLoading || !debouncedFirstName.trim()}
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default AdminSearchUsersPage

