/**
 * CRM Staff Authentication & Permission Middleware
 * Handles role-based access control for CRM staff members
 */

import { Context, Next } from 'hono'
import type { CloudflareBindings } from '../types/cloudflare'

export interface CRMStaffPermissions {
  // CRM permissions
  can_view_dashboard: boolean
  can_view_leads: boolean
  can_edit_leads: boolean
  can_view_staff: boolean
  can_manage_staff: boolean
  can_view_tasks: boolean
  can_edit_tasks: boolean
  can_view_activity_logs: boolean
  
  // Admin permissions
  can_view_kyc: boolean
  can_manage_kyc: boolean
  can_view_withdrawals: boolean
  can_manage_withdrawals: boolean
  can_view_deposits: boolean
  can_view_machines: boolean
  can_view_referrals: boolean
  can_view_reports: boolean
  can_view_users: boolean
}

export interface CRMStaffSession {
  staffId: number
  fullName: string
  email: string
  role: string
  status: string
  permissions: CRMStaffPermissions
}

/**
 * Middleware to require CRM staff authentication
 */
export async function requireCRMAuth(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
  try {
    // Get staff ID from session/cookie (you'll implement your own session management)
    const staffId = c.get('staffId') || c.req.header('X-Staff-ID')
    
    if (!staffId) {
      return c.json({ success: false, error: 'Authentication required' }, 401)
    }

    // Fetch staff data from database
    const { DB } = c.env
    const staff = await DB.prepare(`
      SELECT 
        id, full_name, email, role, status,
        can_view_dashboard, can_view_leads, can_edit_leads,
        can_view_staff, can_manage_staff, can_view_tasks, can_edit_tasks,
        can_view_activity_logs, can_view_kyc, can_manage_kyc,
        can_view_withdrawals, can_manage_withdrawals, can_view_deposits,
        can_view_machines, can_view_referrals, can_view_reports, can_view_users
      FROM crm_staff
      WHERE id = ? AND status = 'active'
    `).bind(staffId).first()

    if (!staff) {
      return c.json({ success: false, error: 'Invalid or inactive staff account' }, 403)
    }

    // Set staff session in context
    c.set('crmStaff', {
      staffId: staff.id,
      fullName: staff.full_name,
      email: staff.email,
      role: staff.role,
      status: staff.status,
      permissions: {
        can_view_dashboard: Boolean(staff.can_view_dashboard),
        can_view_leads: Boolean(staff.can_view_leads),
        can_edit_leads: Boolean(staff.can_edit_leads),
        can_view_staff: Boolean(staff.can_view_staff),
        can_manage_staff: Boolean(staff.can_manage_staff),
        can_view_tasks: Boolean(staff.can_view_tasks),
        can_edit_tasks: Boolean(staff.can_edit_tasks),
        can_view_activity_logs: Boolean(staff.can_view_activity_logs),
        can_view_kyc: Boolean(staff.can_view_kyc),
        can_manage_kyc: Boolean(staff.can_manage_kyc),
        can_view_withdrawals: Boolean(staff.can_view_withdrawals),
        can_manage_withdrawals: Boolean(staff.can_manage_withdrawals),
        can_view_deposits: Boolean(staff.can_view_deposits),
        can_view_machines: Boolean(staff.can_view_machines),
        can_view_referrals: Boolean(staff.can_view_referrals),
        can_view_reports: Boolean(staff.can_view_reports),
        can_view_users: Boolean(staff.can_view_users),
      }
    })

    await next()
  } catch (error) {
    console.error('CRM auth error:', error)
    return c.json({ success: false, error: 'Authentication failed' }, 500)
  }
}

/**
 * Middleware to check specific permission
 */
export function requirePermission(permission: keyof CRMStaffPermissions) {
  return async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const crmStaff = c.get('crmStaff') as CRMStaffSession | undefined

    if (!crmStaff) {
      return c.json({ success: false, error: 'Authentication required' }, 401)
    }

    if (!crmStaff.permissions[permission]) {
      return c.json({ 
        success: false, 
        error: 'Permission denied',
        required_permission: permission
      }, 403)
    }

    await next()
  }
}

/**
 * Middleware to check multiple permissions (AND logic - must have all)
 */
export function requireAllPermissions(...permissions: (keyof CRMStaffPermissions)[]) {
  return async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const crmStaff = c.get('crmStaff') as CRMStaffSession | undefined

    if (!crmStaff) {
      return c.json({ success: false, error: 'Authentication required' }, 401)
    }

    const missingPermissions = permissions.filter(p => !crmStaff.permissions[p])

    if (missingPermissions.length > 0) {
      return c.json({ 
        success: false, 
        error: 'Insufficient permissions',
        missing_permissions: missingPermissions
      }, 403)
    }

    await next()
  }
}

/**
 * Middleware to check multiple permissions (OR logic - must have at least one)
 */
export function requireAnyPermission(...permissions: (keyof CRMStaffPermissions)[]) {
  return async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const crmStaff = c.get('crmStaff') as CRMStaffSession | undefined

    if (!crmStaff) {
      return c.json({ success: false, error: 'Authentication required' }, 401)
    }

    const hasPermission = permissions.some(p => crmStaff.permissions[p])

    if (!hasPermission) {
      return c.json({ 
        success: false, 
        error: 'Permission denied',
        required_permissions: permissions
      }, 403)
    }

    await next()
  }
}

/**
 * Log staff activity
 */
export async function logStaffActivity(
  c: Context<{ Bindings: CloudflareBindings }>,
  action: string,
  resourceType?: string,
  resourceId?: number,
  details?: string
) {
  try {
    const crmStaff = c.get('crmStaff') as CRMStaffSession | undefined
    if (!crmStaff) return

    const { DB } = c.env
    const ipAddress = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'

    await DB.prepare(`
      INSERT INTO crm_staff_activity (staff_id, action, resource_type, resource_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      crmStaff.staffId,
      action,
      resourceType || null,
      resourceId || null,
      details || null,
      ipAddress
    ).run()
  } catch (error) {
    console.error('Failed to log staff activity:', error)
  }
}
