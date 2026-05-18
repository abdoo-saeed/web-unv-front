import { NavLink } from 'react-router-dom'

function Navbar({ isAuthenticated, isAdmin, onLogout, isLoggingOut }) {
  return (
    <header className="site-header">
      <nav className="navbar">
        <NavLink to="/" className="brand">
          <span className="brand-main">Saraha</span>
          <span className="brand-accent">App</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profile
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/send-message" className={({ isActive }) => (isActive ? 'active' : '')}>
                Send
              </NavLink>
              <NavLink to="/get-message" className={({ isActive }) => (isActive ? 'active' : '')}>
                Inbox
              </NavLink>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <>
              <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
                Users
              </NavLink>
              <NavLink to="/admin/search-users" className={({ isActive }) => (isActive ? 'active' : '')}>
                Search Users
              </NavLink>
            </>
          )}
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Login
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
                Signup
              </NavLink>
            </>
          )}
          {isAuthenticated && (
            <button type="button" className="logout-btn" onClick={onLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
