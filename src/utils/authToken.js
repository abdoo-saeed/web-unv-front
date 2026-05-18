import { jwtDecode } from 'jwt-decode'

export function getClaimsFromAccessToken(accessToken) {
  if (!accessToken) return null

  try {
    return jwtDecode(accessToken)
  } catch {
    return null
  }
}

export function isAdminFromClaims(claims) {
  if (!claims) return false

  const aud = claims.aud
  if (Array.isArray(aud)) {
    return aud.some((entry) => String(entry) === '0')
  }
  return String(aud) === '0'
}

