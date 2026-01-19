/**
 * DeepMine AI - Staff Management Routes
 * CRUD operations for staff/admin users
 */

import { Hono } from 'hono'
import type { AdminUser, StaffRole } from '../types/crm'
import { sendStaffWelcomeEmail } from '../utils/email'
import { hashPassword } from '../utils/auth'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

/**
 * GET /api/crm/staff
 * List all staff members with pagination and filtering
 */
app.get('/', async (c) => {
  try {
    const { DB } = c.env
    
    // Query parameters
    const page = parseInt(c.req.query('page') || '1')
    const per_page = parseInt(c.req.query('per_page') || '20')
    const search = c.req.query('search') || ''
    const role_id = c.req.query('role_id')
    const is_active = c.req.query('is_active')
    const offset = (page - 1) * per_page

    // Build query
    let query = `
      SELECT 
        au.id,
        au.username,
        au.email,
        au.full_name,
        au.role,
        au.role_id,
        au.department,
        au.phone,
        au.avatar_url,
        au.is_active,
        au.last_login,
        au.login_count,
        au.created_at,
        sr.display_name as role_display_name,
        sr.name as role_name
      FROM admin_users au
      LEFT JOIN staff_roles sr ON au.role_id = sr.id
      WHERE 1=1
    `
    
    const params: any[] = []
    
    // Search filter
    if (search) {
      query += ` AND (au.full_name LIKE ? OR au.email LIKE ? OR au.username LIKE ?)`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
    }
    
    // Role filter
    if (role_id) {
      query += ` AND au.role_id = ?`
      params.push(parseInt(role_id))
    }
    
    // Active status filter
    if (is_active !== undefined) {
      query += ` AND au.is_active = ?`
      params.push(is_active === 'true' ? 1 : 0)
    }
    
    // Count total
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM')
    const countResult = await DB.prepare(countQuery).bind(...params).first()
    const total = (countResult as any)?.total || 0
    
    // Add pagination
    query += ` ORDER BY au.created_at DESC LIMIT ? OFFSET ?`
    params.push(per_page, offset)
    
    // Execute query
    const result = await DB.prepare(query).bind(...params).all()
    
    return c.json({
      success: true,
      data: {
        staff: result.results || [],
        meta: {
          total,
          page,
          per_page,
          total_pages: Math.ceil(total / per_page)
        }
      }
    })
  } catch (error) {
    console.error('Staff List Error:', error)
    return c.json({ success: false, message: 'Failed to fetch staff list' }, 500)
  }
})

/**
 * GET /api/crm/staff/:id
 * Get single staff member details
 */
app.get('/:id', async (c) => {
  try {
    const { DB } = c.env
    const id = parseInt(c.req.param('id'))
    
    if (isNaN(id)) {
      return c.json({ success: false, message: 'Invalid staff ID' }, 400)
    }
    
    const staff = await DB.prepare(`
      SELECT 
        au.*,
        sr.display_name as role_display_name,
        sr.name as role_name,
        sr.permissions as role_permissions,
        cs.can_view_dashboard,
        cs.can_view_leads,
        cs.can_edit_leads,
        cs.can_view_staff,
        cs.can_manage_staff,
        cs.can_view_tasks,
        cs.can_edit_tasks,
        cs.can_view_activity_logs,
        cs.can_view_kyc,
        cs.can_manage_kyc,
        cs.can_view_withdrawals,
        cs.can_manage_withdrawals,
        cs.can_view_deposits,
        cs.can_view_machines,
        cs.can_view_referrals,
        cs.can_view_reports,
        cs.can_view_users
      FROM admin_users au
      LEFT JOIN staff_roles sr ON au.role_id = sr.id
      LEFT JOIN crm_staff cs ON au.id = cs.id
      WHERE au.id = ?
    `).bind(id).first()
    
    if (!staff) {
      return c.json({ success: false, message: 'Staff member not found' }, 404)
    }
    
    return c.json({ success: true, data: staff })
  } catch (error) {
    console.error('Staff Details Error:', error)
    return c.json({ success: false, message: 'Failed to fetch staff details' }, 500)
  }
})

/**
 * POST /api/crm/staff
 * Create new staff member
 */
app.post('/', async (c) => {
  try {
    const { DB } = c.env
    const body = await c.req.json()
    
    const {
      username,
      email,
      full_name,
      password,
      role_id,
      department,
      phone,
      timezone = 'UTC',
      permissions = {}  // Get permissions from request
    } = body
    
    // Validation
    if (!username || !email || !full_name || !password) {
      return c.json({ 
        success: false, 
        message: 'Username, email, full name, and password are required' 
      }, 400)
    }
    
    // Check if username or email already exists
    const existing = await DB.prepare(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?'
    ).bind(username, email).first()
    
    if (existing) {
      return c.json({ 
        success: false, 
        message: 'Username or email already exists' 
      }, 409)
    }
    
    // Hash password using bcrypt
    const password_hash = await hashPassword(password)
    
    // Get role name if role_id provided
    let role = 'staff'
    if (role_id) {
      const roleData = await DB.prepare('SELECT name FROM staff_roles WHERE id = ?').bind(role_id).first()
      if (roleData) {
        role = (roleData as any).name
      }
    }
    
    // Insert new staff member
    const result = await DB.prepare(`
      INSERT INTO admin_users (
        username, email, full_name, password_hash, role, role_id,
        department, phone, timezone, is_active, login_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, datetime('now'), datetime('now'))
    `).bind(
      username,
      email,
      full_name,
      password_hash,
      role,
      role_id || null,
      department || null,
      phone || null,
      timezone
    ).run()
    
    const newStaffId = result.meta.last_row_id
    
    // Insert permissions into crm_staff table
    await DB.prepare(`
      INSERT INTO crm_staff (
        id, full_name, email, password_hash, role, status,
        can_view_dashboard, can_view_leads, can_edit_leads,
        can_view_staff, can_manage_staff, can_view_tasks, can_edit_tasks,
        can_view_activity_logs, can_view_kyc, can_manage_kyc,
        can_view_withdrawals, can_manage_withdrawals, can_view_deposits,
        can_view_machines, can_view_referrals, can_view_reports, can_view_users,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      newStaffId,
      full_name,
      email,
      password_hash,
      role,
      'active',
      permissions.can_view_dashboard ? 1 : 0,
      permissions.can_view_leads ? 1 : 0,
      permissions.can_edit_leads ? 1 : 0,
      permissions.can_view_staff ? 1 : 0,
      permissions.can_manage_staff ? 1 : 0,
      permissions.can_view_tasks ? 1 : 0,
      permissions.can_edit_tasks ? 1 : 0,
      permissions.can_view_activity_logs ? 1 : 0,
      permissions.can_view_kyc ? 1 : 0,
      permissions.can_manage_kyc ? 1 : 0,
      permissions.can_view_withdrawals ? 1 : 0,
      permissions.can_manage_withdrawals ? 1 : 0,
      permissions.can_view_deposits ? 1 : 0,
      permissions.can_view_machines ? 1 : 0,
      permissions.can_view_referrals ? 1 : 0,
      permissions.can_view_reports ? 1 : 0,
      permissions.can_view_users ? 1 : 0
    ).run()
    
    // Log activity
    await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, action_category, resource_type, resource_id,
        resource_name, description, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      null, // TODO: Get current admin's ID from auth
      'created',
      'staff',
      'admin_user',
      newStaffId,
      full_name,
      `New staff member "${full_name}" created`,
      'info'
    ).run()
    
    // Fetch the created staff member
    const newStaff = await DB.prepare(`
      SELECT 
        au.*,
        sr.display_name as role_display_name,
        sr.name as role_name
      FROM admin_users au
      LEFT JOIN staff_roles sr ON au.role_id = sr.id
      WHERE au.id = ?
    `).bind(newStaffId).first()
    
    // Send welcome email with login credentials
    const { RESEND_API_KEY } = c.env
    if (RESEND_API_KEY) {
      // Build permissions list for email
      const permissionNames: string[] = []
      if (permissions.can_view_dashboard) permissionNames.push('View Dashboard')
      if (permissions.can_view_leads) permissionNames.push('View Leads')
      if (permissions.can_edit_leads) permissionNames.push('Edit Leads')
      if (permissions.can_view_staff) permissionNames.push('View Staff')
      if (permissions.can_manage_staff) permissionNames.push('Manage Staff')
      if (permissions.can_view_tasks) permissionNames.push('View Tasks')
      if (permissions.can_edit_tasks) permissionNames.push('Edit Tasks')
      if (permissions.can_view_activity_logs) permissionNames.push('View Activity Logs')
      if (permissions.can_view_kyc) permissionNames.push('View KYC')
      if (permissions.can_manage_kyc) permissionNames.push('Manage KYC')
      if (permissions.can_view_withdrawals) permissionNames.push('View Withdrawals')
      if (permissions.can_manage_withdrawals) permissionNames.push('Manage Withdrawals')
      if (permissions.can_view_deposits) permissionNames.push('View Deposits')
      if (permissions.can_view_machines) permissionNames.push('View Machines')
      if (permissions.can_view_referrals) permissionNames.push('View Referrals')
      if (permissions.can_view_reports) permissionNames.push('View Reports')
      if (permissions.can_view_users) permissionNames.push('View Users')
      
      try {
        await sendStaffWelcomeEmail(
          email,
          full_name,
          username,
          password, // Send the plain password (only time it's available)
          role,
          permissionNames,
          RESEND_API_KEY
        )
        console.log(`Welcome email sent to ${email}`)
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail the request if email fails - staff is already created
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping welcome email')
    }
    
    return c.json({
      success: true,
      message: 'Staff member created successfully. Welcome email sent to ' + email,
      data: newStaff
    }, 201)
  } catch (error) {
    console.error('Create Staff Error:', error)
    return c.json({ success: false, message: 'Failed to create staff member' }, 500)
  }
})

/**
 * PUT /api/crm/staff/:id
 * Update staff member
 */
app.put('/:id', async (c) => {
  try {
    const { DB } = c.env
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()
    
    if (isNaN(id)) {
      return c.json({ success: false, message: 'Invalid staff ID' }, 400)
    }
    
    // Check if staff exists
    const existing = await DB.prepare('SELECT id, full_name FROM admin_users WHERE id = ?').bind(id).first()
    if (!existing) {
      return c.json({ success: false, message: 'Staff member not found' }, 404)
    }
    
    const {
      email,
      full_name,
      role_id,
      department,
      phone,
      timezone,
      is_active,
      notification_preferences,
      permissions = {}  // Get permissions from request
    } = body
    
    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []
    
    if (email !== undefined) {
      updates.push('email = ?')
      params.push(email)
    }
    if (full_name !== undefined) {
      updates.push('full_name = ?')
      params.push(full_name)
    }
    if (role_id !== undefined) {
      updates.push('role_id = ?')
      params.push(role_id)
      
      // Update role name
      const roleData = await DB.prepare('SELECT name FROM staff_roles WHERE id = ?').bind(role_id).first()
      if (roleData) {
        updates.push('role = ?')
        params.push((roleData as any).name)
      }
    }
    if (department !== undefined) {
      updates.push('department = ?')
      params.push(department)
    }
    if (phone !== undefined) {
      updates.push('phone = ?')
      params.push(phone)
    }
    if (timezone !== undefined) {
      updates.push('timezone = ?')
      params.push(timezone)
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?')
      params.push(is_active ? 1 : 0)
    }
    if (notification_preferences !== undefined) {
      updates.push('notification_preferences = ?')
      params.push(JSON.stringify(notification_preferences))
    }
    
    if (updates.length === 0 && Object.keys(permissions).length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }
    
    // Update admin_users table
    if (updates.length > 0) {
      updates.push('updated_at = datetime("now")')
      params.push(id)
      
      const query = `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`
      await DB.prepare(query).bind(...params).run()
    }
    
    // Update crm_staff permissions if provided
    if (Object.keys(permissions).length > 0) {
      // Check if crm_staff record exists
      const crmStaffExists = await DB.prepare('SELECT id FROM crm_staff WHERE id = ?').bind(id).first()
      
      if (crmStaffExists) {
        // Update existing permissions
        const permUpdates: string[] = []
        const permParams: any[] = []
        
        if (permissions.can_view_dashboard !== undefined) {
          permUpdates.push('can_view_dashboard = ?')
          permParams.push(permissions.can_view_dashboard ? 1 : 0)
        }
        if (permissions.can_view_leads !== undefined) {
          permUpdates.push('can_view_leads = ?')
          permParams.push(permissions.can_view_leads ? 1 : 0)
        }
        if (permissions.can_edit_leads !== undefined) {
          permUpdates.push('can_edit_leads = ?')
          permParams.push(permissions.can_edit_leads ? 1 : 0)
        }
        if (permissions.can_view_staff !== undefined) {
          permUpdates.push('can_view_staff = ?')
          permParams.push(permissions.can_view_staff ? 1 : 0)
        }
        if (permissions.can_manage_staff !== undefined) {
          permUpdates.push('can_manage_staff = ?')
          permParams.push(permissions.can_manage_staff ? 1 : 0)
        }
        if (permissions.can_view_tasks !== undefined) {
          permUpdates.push('can_view_tasks = ?')
          permParams.push(permissions.can_view_tasks ? 1 : 0)
        }
        if (permissions.can_edit_tasks !== undefined) {
          permUpdates.push('can_edit_tasks = ?')
          permParams.push(permissions.can_edit_tasks ? 1 : 0)
        }
        if (permissions.can_view_activity_logs !== undefined) {
          permUpdates.push('can_view_activity_logs = ?')
          permParams.push(permissions.can_view_activity_logs ? 1 : 0)
        }
        if (permissions.can_view_kyc !== undefined) {
          permUpdates.push('can_view_kyc = ?')
          permParams.push(permissions.can_view_kyc ? 1 : 0)
        }
        if (permissions.can_manage_kyc !== undefined) {
          permUpdates.push('can_manage_kyc = ?')
          permParams.push(permissions.can_manage_kyc ? 1 : 0)
        }
        if (permissions.can_view_withdrawals !== undefined) {
          permUpdates.push('can_view_withdrawals = ?')
          permParams.push(permissions.can_view_withdrawals ? 1 : 0)
        }
        if (permissions.can_manage_withdrawals !== undefined) {
          permUpdates.push('can_manage_withdrawals = ?')
          permParams.push(permissions.can_manage_withdrawals ? 1 : 0)
        }
        if (permissions.can_view_deposits !== undefined) {
          permUpdates.push('can_view_deposits = ?')
          permParams.push(permissions.can_view_deposits ? 1 : 0)
        }
        if (permissions.can_view_machines !== undefined) {
          permUpdates.push('can_view_machines = ?')
          permParams.push(permissions.can_view_machines ? 1 : 0)
        }
        if (permissions.can_view_referrals !== undefined) {
          permUpdates.push('can_view_referrals = ?')
          permParams.push(permissions.can_view_referrals ? 1 : 0)
        }
        if (permissions.can_view_reports !== undefined) {
          permUpdates.push('can_view_reports = ?')
          permParams.push(permissions.can_view_reports ? 1 : 0)
        }
        if (permissions.can_view_users !== undefined) {
          permUpdates.push('can_view_users = ?')
          permParams.push(permissions.can_view_users ? 1 : 0)
        }
        
        if (permUpdates.length > 0) {
          permUpdates.push('updated_at = datetime("now")')
          permParams.push(id)
          
          const permQuery = `UPDATE crm_staff SET ${permUpdates.join(', ')} WHERE id = ?`
          await DB.prepare(permQuery).bind(...permParams).run()
        }
      } else {
        // Create new crm_staff record if it doesn't exist
        const staffInfo = await DB.prepare('SELECT full_name, email, password_hash, role FROM admin_users WHERE id = ?').bind(id).first()
        if (staffInfo) {
          await DB.prepare(`
            INSERT INTO crm_staff (
              id, full_name, email, password_hash, role, status,
              can_view_dashboard, can_view_leads, can_edit_leads,
              can_view_staff, can_manage_staff, can_view_tasks, can_edit_tasks,
              can_view_activity_logs, can_view_kyc, can_manage_kyc,
              can_view_withdrawals, can_manage_withdrawals, can_view_deposits,
              can_view_machines, can_view_referrals, can_view_reports, can_view_users,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `).bind(
            id,
            (staffInfo as any).full_name,
            (staffInfo as any).email,
            (staffInfo as any).password_hash,
            (staffInfo as any).role,
            'active',
            permissions.can_view_dashboard ? 1 : 0,
            permissions.can_view_leads ? 1 : 0,
            permissions.can_edit_leads ? 1 : 0,
            permissions.can_view_staff ? 1 : 0,
            permissions.can_manage_staff ? 1 : 0,
            permissions.can_view_tasks ? 1 : 0,
            permissions.can_edit_tasks ? 1 : 0,
            permissions.can_view_activity_logs ? 1 : 0,
            permissions.can_view_kyc ? 1 : 0,
            permissions.can_manage_kyc ? 1 : 0,
            permissions.can_view_withdrawals ? 1 : 0,
            permissions.can_manage_withdrawals ? 1 : 0,
            permissions.can_view_deposits ? 1 : 0,
            permissions.can_view_machines ? 1 : 0,
            permissions.can_view_referrals ? 1 : 0,
            permissions.can_view_reports ? 1 : 0,
            permissions.can_view_users ? 1 : 0
          ).run()
        }
      }
    }
    
    // Log activity
    await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, action_category, resource_type, resource_id,
        resource_name, description, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      null,
      'updated',
      'staff',
      'admin_user',
      id,
      (existing as any).full_name,
      `Staff member "${(existing as any).full_name}" updated`,
      'info'
    ).run()
    
    // Fetch updated staff
    const updated = await DB.prepare(`
      SELECT 
        au.*,
        sr.display_name as role_display_name,
        sr.name as role_name
      FROM admin_users au
      LEFT JOIN staff_roles sr ON au.role_id = sr.id
      WHERE au.id = ?
    `).bind(id).first()
    
    return c.json({
      success: true,
      message: 'Staff member updated successfully',
      data: updated
    })
  } catch (error) {
    console.error('Update Staff Error:', error)
    return c.json({ success: false, message: 'Failed to update staff member' }, 500)
  }
})

/**
 * DELETE /api/crm/staff/:id
 * Deactivate staff member (soft delete)
 */
app.delete('/:id', async (c) => {
  try {
    const { DB } = c.env
    const id = parseInt(c.req.param('id'))
    
    if (isNaN(id)) {
      return c.json({ success: false, message: 'Invalid staff ID' }, 400)
    }
    
    // Check if staff exists
    const existing = await DB.prepare('SELECT id, full_name FROM admin_users WHERE id = ?').bind(id).first()
    if (!existing) {
      return c.json({ success: false, message: 'Staff member not found' }, 404)
    }
    
    // Soft delete - set is_active to 0
    await DB.prepare('UPDATE admin_users SET is_active = 0, updated_at = datetime("now") WHERE id = ?').bind(id).run()
    
    // Log activity
    await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, action_category, resource_type, resource_id,
        resource_name, description, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      null,
      'deleted',
      'staff',
      'admin_user',
      id,
      (existing as any).full_name,
      `Staff member "${(existing as any).full_name}" deactivated`,
      'warning'
    ).run()
    
    return c.json({
      success: true,
      message: 'Staff member deactivated successfully'
    })
  } catch (error) {
    console.error('Delete Staff Error:', error)
    return c.json({ success: false, message: 'Failed to deactivate staff member' }, 500)
  }
})

/**
 * GET /api/crm/roles
 * List all available staff roles
 */
app.get('/roles/list', async (c) => {
  try {
    const { DB } = c.env
    
    const roles = await DB.prepare(`
      SELECT id, name, display_name, description, permissions, is_system_role
      FROM staff_roles
      ORDER BY 
        CASE 
          WHEN name = 'super_admin' THEN 1
          WHEN name = 'admin' THEN 2
          WHEN name = 'kyc_specialist' THEN 3
          WHEN name = 'support_agent' THEN 4
          WHEN name = 'finance_manager' THEN 5
          ELSE 6
        END
    `).all()
    
    return c.json({
      success: true,
      data: roles.results || []
    })
  } catch (error) {
    console.error('Roles List Error:', error)
    return c.json({ success: false, message: 'Failed to fetch roles' }, 500)
  }
})

/**
 * POST /api/crm/staff/:id/resend-welcome
 * Resend welcome email to staff member (also fixes unhashed passwords)
 */
app.post('/:id/resend-welcome', async (c) => {
  try {
    const { DB, RESEND_API_KEY } = c.env
    const staffId = c.req.param('id')

    // Get staff member
    const staff = await DB.prepare(`
      SELECT * FROM admin_users WHERE id = ?
    `).bind(staffId).first() as any

    if (!staff) {
      return c.json({ success: false, message: 'Staff member not found' }, 404)
    }

    // Check if password needs to be hashed (if it doesn't start with $2a or $2b)
    let passwordToSend = staff.password_hash
    const needsHashing = !staff.password_hash.startsWith('$2')
    
    if (needsHashing) {
      console.log(`⚠️ Unhashed password detected for ${staff.email}, fixing...`)
      const plainPassword = staff.password_hash
      const hashedPassword = await hashPassword(plainPassword)
      
      // Update with hashed password
      await DB.prepare(`
        UPDATE admin_users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(hashedPassword, staffId).run()
      
      passwordToSend = plainPassword
      console.log(`✅ Password hashed for ${staff.email}`)
    } else {
      return c.json({ 
        success: false, 
        message: 'Cannot resend email - original password is hashed and not available' 
      }, 400)
    }

    if (!RESEND_API_KEY) {
      return c.json({ 
        success: false, 
        message: 'Email service not configured' 
      }, 500)
    }

    // Get permissions (simplified for now)
    const permissionNames: string[] = ['Administrator Access']

    // Send welcome email
    try {
      await sendStaffWelcomeEmail(
        staff.email,
        staff.full_name || staff.username,
        staff.username,
        passwordToSend,
        staff.role || 'Staff',
        permissionNames,
        RESEND_API_KEY
      )
      console.log(`✅ Welcome email resent to ${staff.email}`)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      return c.json({ 
        success: false, 
        message: 'Failed to send email: ' + (emailError as Error).message 
      }, 500)
    }

    return c.json({
      success: true,
      message: `Welcome email sent successfully to ${staff.email}${needsHashing ? ' (password also fixed and hashed)' : ''}`
    })

  } catch (error) {
    console.error('Resend Welcome Email Error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to resend welcome email' 
    }, 500)
  }
})

/**
 * POST /api/crm/staff/me/change-password
 * Change current staff member's password
 */
app.post('/me/change-password', async (c) => {
  try {
    const { DB } = c.env
    
    // Get admin info from cookie/context (set by middleware)
    const adminToken = c.req.header('Authorization')?.replace('Bearer ', '') || 
                       (await import('hono/cookie')).getCookie(c, 'admin_token')
    
    if (!adminToken) {
      return c.json({ success: false, message: 'Not authenticated' }, 401)
    }

    // Parse token to get admin_id
    let adminId: number
    try {
      const payload = JSON.parse(atob(adminToken))
      adminId = payload.admin_id
      
      if (!adminId) {
        return c.json({ success: false, message: 'Invalid token' }, 401)
      }
    } catch {
      return c.json({ success: false, message: 'Invalid token format' }, 401)
    }

    // Get request body
    const body = await c.req.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return c.json({ 
        success: false, 
        message: 'Current password, new password, and confirmation are required' 
      }, 400)
    }

    if (newPassword !== confirmPassword) {
      return c.json({ 
        success: false, 
        message: 'New password and confirmation do not match' 
      }, 400)
    }

    if (newPassword.length < 8) {
      return c.json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      }, 400)
    }

    if (newPassword === currentPassword) {
      return c.json({ 
        success: false, 
        message: 'New password must be different from current password' 
      }, 400)
    }

    // Fetch staff member from admin_users table
    const staff = await DB.prepare(`
      SELECT id, email, full_name, password_hash, is_active
      FROM admin_users
      WHERE id = ? AND is_active = 1
    `).bind(adminId).first<{
      id: number
      email: string
      full_name: string
      password_hash: string
      is_active: number
    }>()

    if (!staff) {
      return c.json({ success: false, message: 'Staff member not found' }, 404)
    }

    // Verify current password using bcryptjs
    const { comparePassword } = await import('../utils/auth')
    const validPassword = await comparePassword(currentPassword, staff.password_hash)

    if (!validPassword) {
      return c.json({ 
        success: false, 
        message: 'Current password is incorrect' 
      }, 401)
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password in database
    await DB.prepare(`
      UPDATE admin_users 
      SET password_hash = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(newPasswordHash, adminId).run()

    console.log(`✅ Password changed successfully for staff: ${staff.email}`)

    return c.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change Password Error:', error)
    return c.json({ 
      success: false, 
      message: 'Failed to change password' 
    }, 500)
  }
})

export default app
