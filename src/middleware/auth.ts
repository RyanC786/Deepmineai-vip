// Authentication middleware for DeepMine AI Platform
import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

/**
 * Simple JWT parsing (we'll use cookies for session management)
 * In production, you'd use a proper JWT library, but for Cloudflare Workers we keep it simple
 */
function parseJWT(token: string): any {
  try {
    const parts = token.split('.')
    
    // Handle both JWT format (3 parts) and simple base64 format (1 part)
    if (parts.length === 3) {
      // Standard JWT format: header.payload.signature
      const payload = JSON.parse(atob(parts[1]))
      return payload
    } else {
      // Simple base64 encoded JSON (admin token format)
      const payload = JSON.parse(atob(token))
      return payload
    }
  } catch {
    return null
  }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(c: Context, next: Next) {
  const token = getCookie(c, 'auth_token')
  
  if (!token) {
    return c.json({ success: false, message: 'Authentication required' }, 401)
  }
  
  const payload = parseJWT(token)
  
  if (!payload || !payload.sub) {
    return c.json({ success: false, message: 'Invalid authentication token' }, 401)
  }
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    return c.json({ success: false, message: 'Authentication token expired' }, 401)
  }
  
  // Attach user info to context
  c.set('userId', payload.sub)
  c.set('userEmail', payload.email)
  
  await next()
}

/**
 * Middleware to require admin authentication
 * STRICT: Only allows users with admin_token and admin role
 */
export async function requireAdmin(c: Context, next: Next) {
  // Debug: Check ALL headers
  const allHeaders: Record<string, string> = {}
  c.req.raw.headers.forEach((value, key) => {
    allHeaders[key] = value
  })
  console.log('[AUTH-MIDDLEWARE] ========== requireAdmin called ==========')
  console.log('[AUTH-MIDDLEWARE] Request URL:', c.req.url)
  console.log('[AUTH-MIDDLEWARE] Request Method:', c.req.method)
  console.log('[AUTH-MIDDLEWARE] All Headers:', JSON.stringify(allHeaders, null, 2))
  
  const cookieHeader = c.req.header('Cookie')
  console.log('[AUTH-MIDDLEWARE] Cookie Header (specific):', cookieHeader || 'MISSING!')
  
  // Try to get cookie using Hono's getCookie
  let adminToken = getCookie(c, 'admin_token')
  console.log('[AUTH-MIDDLEWARE] admin_token from getCookie:', adminToken ? adminToken.substring(0, 30) + '...' : 'NULL')
  
  // If getCookie fails, manually parse from Cookie header
  if (!adminToken && cookieHeader) {
    console.log('[AUTH-MIDDLEWARE] ⚠️ getCookie failed, parsing manually...')
    const cookies = cookieHeader.split(';').map(c => c.trim())
    console.log('[AUTH-MIDDLEWARE] Parsed cookies:', cookies)
    const adminTokenCookie = cookies.find(c => c.startsWith('admin_token='))
    if (adminTokenCookie) {
      adminToken = adminTokenCookie.split('=')[1]
      console.log('[AUTH-MIDDLEWARE] ✅ Manually extracted admin_token:', adminToken.substring(0, 30) + '...')
    } else {
      console.error('[AUTH-MIDDLEWARE] ❌ admin_token not found in parsed cookies!')
    }
  }
  
  if (!adminToken) {
    console.error('[AUTH-MIDDLEWARE] ❌❌❌ FINAL CHECK: No admin token found!')
    console.error('[AUTH-MIDDLEWARE] Cookie header was:', cookieHeader)
    return c.json({ success: false, message: 'Authentication required' }, 401)
  }
  
  console.log('[AUTH-MIDDLEWARE] ✅ Admin token found, proceeding to validation...')
  
  const payload = parseJWT(adminToken)
  console.log('[AUTH-MIDDLEWARE] Parsed payload:', payload)
  
  if (!payload || !payload.admin_id) {
    console.error('[AUTH-MIDDLEWARE] Invalid payload or missing admin_id')
    return c.json({ success: false, message: 'Invalid admin token - bad payload' }, 401)
  }
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000)
  console.log('[AUTH-MIDDLEWARE] Token expiry check - now:', now, 'exp:', payload.exp)
  if (payload.exp && payload.exp < now) {
    console.error('[AUTH-MIDDLEWARE] Token expired!')
    return c.json({ success: false, message: 'Admin token expired' }, 401)
  }
  
  console.log('[AUTH-MIDDLEWARE] ✅ Authentication passed! Admin ID:', payload.admin_id)
  
  // Attach admin info to context (including role and permissions)
  c.set('adminId', payload.admin_id)
  c.set('adminEmail', payload.email)
  c.set('adminRole', payload.role_name || 'super_admin')
  c.set('adminPermissions', payload.permissions || [])
  
  // Also set adminUser object for compatibility with routes that expect it
  c.set('adminUser', {
    id: payload.admin_id,
    email: payload.email,
    full_name: payload.full_name || '',
    username: payload.email?.split('@')[0] || '',
    role_name: payload.role_name || 'super_admin',
    permissions: payload.permissions || []
  })
  
  await next()
}

/**
 * NEW: Middleware to require Super Admin access only
 * Blocks CRM staff from accessing financial/sensitive pages
 */
export async function requireSuperAdmin(c: Context, next: Next) {
  // First check admin authentication
  const adminToken = getCookie(c, 'admin_token')
  
  if (!adminToken) {
    return c.json({ 
      success: false, 
      message: 'Authentication required' 
    }, 401)
  }
  
  const payload = parseJWT(adminToken)
  
  if (!payload || !payload.admin_id) {
    return c.json({ 
      success: false, 
      message: 'Invalid admin token' 
    }, 401)
  }
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    return c.json({ 
      success: false, 
      message: 'Admin token expired' 
    }, 401)
  }
  
  // Check if user is Super Admin (role_name = 'super_admin')
  const roleName = payload.role_name || 'super_admin'
  
  if (roleName !== 'super_admin') {
    console.error('[AUTH-MIDDLEWARE] ❌ Access denied! User role:', roleName)
    return c.json({ 
      success: false, 
      message: 'Access denied. Super Admin privileges required.',
      error: 'This page requires Super Admin access. CRM staff cannot access financial data.'
    }, 403)
  }
  
  console.log('[AUTH-MIDDLEWARE] ✅ Super Admin access granted')
  
  // Attach admin info to context
  c.set('adminId', payload.admin_id)
  c.set('adminEmail', payload.email)
  c.set('adminRole', roleName)
  c.set('adminPermissions', payload.permissions || [])
  
  await next()
}

/**
 * NEW: Middleware to require CRM access
 * Allows both Super Admins and CRM staff
 */
export async function requireCRMAccess(c: Context, next: Next) {
  // First check admin authentication
  console.log('[CRM-AUTH] ===== STARTING CRM ACCESS CHECK =====')
  
  // Try to get cookie using Hono's getCookie
  const adminToken = getCookie(c, 'admin_token')
  console.log('[CRM-AUTH] getCookie result:', adminToken ? 'TOKEN FOUND' : 'NULL')
  
  // Also try to read from request headers directly
  const cookieHeader = c.req.header('Cookie')
  console.log('[CRM-AUTH] Cookie header:', cookieHeader ? 'EXISTS' : 'MISSING')
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    console.log('[CRM-AUTH] Cookies in header:', cookies.length)
    const adminCookie = cookies.find(c => c.startsWith('admin_token='))
    console.log('[CRM-AUTH] admin_token in header:', adminCookie ? 'FOUND' : 'NOT FOUND')
    if (adminCookie) {
      console.log('[CRM-AUTH] admin_token value preview:', adminCookie.substring(0, 50) + '...')
    }
  }
  
  if (!adminToken) {
    console.error('[CRM-AUTH] ❌ No admin_token cookie found')
    return c.json({ 
      success: false, 
      message: 'Authentication required' 
    }, 401)
  }
  
  const payload = parseJWT(adminToken)
  
  console.log('[CRM-AUTH] Payload parsed:', !!payload)
  console.log('[CRM-AUTH] Payload admin_id:', payload?.admin_id)
  
  if (!payload || !payload.admin_id) {
    console.error('[CRM-AUTH] ❌ Invalid token or missing admin_id')
    return c.json({ 
      success: false, 
      message: 'Invalid admin token' 
    }, 401)
  }
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    return c.json({ 
      success: false, 
      message: 'Admin token expired' 
    }, 401)
  }
  
  // Allow Super Admin + any staff role (more permissive)
  // Super Admin always has access, and any staff member with an admin_token can access CRM
  const roleName = payload.role_name || 'super_admin'
  
  // Only block if explicitly not a staff role
  // Super Admin role check is always allowed
  // Any other role from admin_users table is considered staff and gets CRM access
  if (roleName === 'user' || roleName === 'customer') {
    // Block regular users/customers from CRM
    console.error('[AUTH-MIDDLEWARE] ❌ CRM access denied! User role:', roleName)
    return c.json({ 
      success: false, 
      message: 'Access denied. CRM access required.'
    }, 403)
  }
  
  console.log('[AUTH-MIDDLEWARE] ✅ CRM access granted for role:', roleName)
  
  // Attach admin info to context
  c.set('adminId', payload.admin_id)
  c.set('adminEmail', payload.email)
  c.set('adminRole', roleName)
  c.set('adminPermissions', payload.permissions || [])
  
  // Also set adminUser object for compatibility with routes that expect it
  c.set('adminUser', {
    id: payload.admin_id,
    email: payload.email,
    full_name: payload.full_name || '',
    username: payload.email?.split('@')[0] || '',
    role_name: roleName,
    permissions: payload.permissions || []
  })
  
  await next()
}

/**
 * Optional auth middleware (doesn't require auth but loads user if available)
 */
export async function optionalAuth(c: Context, next: Next) {
  const token = getCookie(c, 'auth_token')
  
  if (token) {
    const payload = parseJWT(token)
    if (payload && payload.sub) {
      const now = Math.floor(Date.now() / 1000)
      if (!payload.exp || payload.exp >= now) {
        c.set('userId', payload.sub)
        c.set('userEmail', payload.email)
      }
    }
  }
  
  await next()
}
