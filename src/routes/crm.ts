/**
 * DeepMine AI - CRM Dashboard Routes
 * Provides API endpoints for the admin CRM system
 */

import { Hono } from 'hono'
import type { DashboardStats, ActivityLog, StaffTask, Notification } from '../types/crm'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

/**
 * GET /api/crm/permissions
 * Returns current staff's permissions for UI rendering
 */
app.get('/permissions', async (c) => {
  try {
    console.log('[CRM-PERMISSIONS] 🔍 Fetching permissions...')
    
    // Get staff ID from context (set by requireCRMAccess middleware)
    const staffId = c.get('adminId')
    console.log('[CRM-PERMISSIONS] Staff ID from context:', staffId)
    
    if (!staffId) {
      console.error('[CRM-PERMISSIONS] ❌ No staff ID in context')
      return c.json({
        success: false,
        error: 'Authentication required'
      }, 401)
    }
    
    const { DB } = c.env
    
    // Query admin_users table (where CRM staff are stored)
    const staff = await DB.prepare(`
      SELECT 
        au.id, au.full_name, au.email, au.is_active,
        sr.name as role_name, sr.display_name as role_display_name,
        cs.can_view_dashboard, cs.can_view_leads, cs.can_edit_leads,
        cs.can_view_staff, cs.can_manage_staff, cs.can_view_tasks, cs.can_edit_tasks,
        cs.can_view_activity_logs, cs.can_view_kyc, cs.can_manage_kyc,
        cs.can_view_withdrawals, cs.can_manage_withdrawals, cs.can_view_deposits,
        cs.can_view_machines, cs.can_view_referrals, cs.can_view_reports, cs.can_view_users
      FROM admin_users au
      LEFT JOIN staff_roles sr ON au.role_id = sr.id
      LEFT JOIN crm_staff cs ON au.id = cs.id
      WHERE au.id = ? AND au.is_active = 1
    `).bind(staffId).first()

    console.log('[CRM-PERMISSIONS] Staff found:', staff ? 'Yes' : 'No')

    if (!staff) {
      console.error('[CRM-PERMISSIONS] ❌ Staff not found or inactive')
      return c.json({
        success: false,
        error: 'Staff not found or inactive'
      }, 404)
    }
    
    console.log('[CRM-PERMISSIONS] ✅ Permissions loaded for:', staff.full_name)

    return c.json({
      success: true,
      staff: {
        id: staff.id,
        fullName: staff.full_name,
        email: staff.email,
        role: staff.role_name || 'staff',
        roleDisplayName: staff.role_display_name || 'Staff Member',
        status: staff.is_active ? 'active' : 'inactive'
      },
      permissions: {
        // CRM permissions (default to false if crm_staff entry doesn't exist)
        can_view_dashboard: Boolean(staff.can_view_dashboard ?? true), // Default true for dashboard
        can_view_leads: Boolean(staff.can_view_leads ?? false),
        can_edit_leads: Boolean(staff.can_edit_leads ?? false),
        can_view_staff: Boolean(staff.can_view_staff ?? false),
        can_manage_staff: Boolean(staff.can_manage_staff ?? false),
        can_view_tasks: Boolean(staff.can_view_tasks ?? false),
        can_edit_tasks: Boolean(staff.can_edit_tasks ?? false),
        can_view_activity_logs: Boolean(staff.can_view_activity_logs ?? false),
        
        // Admin permissions
        can_view_kyc: Boolean(staff.can_view_kyc ?? false),
        can_manage_kyc: Boolean(staff.can_manage_kyc ?? false),
        can_view_withdrawals: Boolean(staff.can_view_withdrawals ?? false),
        can_manage_withdrawals: Boolean(staff.can_manage_withdrawals ?? false),
        can_view_deposits: Boolean(staff.can_view_deposits ?? false),
        can_view_machines: Boolean(staff.can_view_machines ?? false),
        can_view_referrals: Boolean(staff.can_view_referrals ?? false),
        can_view_reports: Boolean(staff.can_view_reports ?? false),
        can_view_users: Boolean(staff.can_view_users ?? false),
      }
    })
  } catch (error) {
    console.error('Error fetching staff permissions:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch permissions'
    }, 500)
  }
})

/**
 * GET /api/crm/dashboard
 * Returns comprehensive dashboard statistics for CRM
 */
app.get('/dashboard', async (c) => {
  try {
    const { DB } = c.env
    const now = new Date().toISOString()
    const today = now.split('T')[0]
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Get overview statistics
    const totalUsers = await DB.prepare('SELECT COUNT(*) as count FROM users').first()
    const activeUsers = await DB.prepare('SELECT COUNT(*) as count FROM users WHERE account_status = ?').bind('active').first()
    const newUsersToday = await DB.prepare('SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?').bind(today).first()
    const newUsersThisWeek = await DB.prepare('SELECT COUNT(*) as count FROM users WHERE created_at >= ?').bind(oneWeekAgo).first()

    // Get KYC statistics
    const kycPending = await DB.prepare('SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ?').bind('pending').first()
    const kycApprovedToday = await DB.prepare('SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ? AND DATE(reviewed_at) = ?').bind('approved', today).first()
    const kycApprovedThisWeek = await DB.prepare('SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ? AND reviewed_at >= ?').bind('approved', oneWeekAgo).first()
    const kycRejectedToday = await DB.prepare('SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ? AND DATE(reviewed_at) = ?').bind('rejected', today).first()

    // Get withdrawal statistics
    const withdrawalsPending = await DB.prepare('SELECT COUNT(*) as count FROM withdrawals WHERE status = ?').bind('pending').first()
    const withdrawalsApprovedToday = await DB.prepare('SELECT COUNT(*) as count FROM withdrawals WHERE status = ? AND DATE(updated_at) = ?').bind('approved', today).first()
    const withdrawalsPendingAmount = await DB.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = ?').bind('pending').first()

    // Get ticket statistics (if table exists)
    let ticketsOpen = { count: 0 }
    let ticketsAssigned = { count: 0 }
    let ticketsResolvedToday = { count: 0 }
    
    try {
      ticketsOpen = await DB.prepare('SELECT COUNT(*) as count FROM support_tickets WHERE status = ?').bind('open').first() || { count: 0 }
      ticketsAssigned = await DB.prepare('SELECT COUNT(*) as count FROM support_tickets WHERE status = ?').bind('assigned').first() || { count: 0 }
      ticketsResolvedToday = await DB.prepare('SELECT COUNT(*) as count FROM support_tickets WHERE status = ? AND DATE(resolved_at) = ?').bind('resolved', today).first() || { count: 0 }
    } catch (e) {
      console.log('Tickets table not ready yet')
    }

    // Get staff statistics
    const totalActiveStaff = await DB.prepare('SELECT COUNT(*) as count FROM admin_users WHERE is_active = 1').first()

    // Build dashboard stats
    const stats: DashboardStats = {
      overview: {
        total_users: (totalUsers as any)?.count || 0,
        active_users: (activeUsers as any)?.count || 0,
        new_users_today: (newUsersToday as any)?.count || 0,
        new_users_this_week: (newUsersThisWeek as any)?.count || 0
      },
      kyc: {
        pending: (kycPending as any)?.count || 0,
        approved_today: (kycApprovedToday as any)?.count || 0,
        approved_this_week: (kycApprovedThisWeek as any)?.count || 0,
        rejected_today: (kycRejectedToday as any)?.count || 0,
        avg_approval_time_minutes: 0 // TODO: Calculate from activity logs
      },
      withdrawals: {
        pending: (withdrawalsPending as any)?.count || 0,
        approved_today: (withdrawalsApprovedToday as any)?.count || 0,
        total_amount_pending: parseFloat((withdrawalsPendingAmount as any)?.total || '0')
      },
      tickets: {
        open: (ticketsOpen as any)?.count || 0,
        assigned: (ticketsAssigned as any)?.count || 0,
        resolved_today: (ticketsResolvedToday as any)?.count || 0,
        avg_response_time_minutes: 0
      },
      tasks: {
        my_pending: 0, // TODO: Get from authenticated admin
        my_in_progress: 0,
        my_completed_today: 0,
        team_pending: 0
      },
      staff: {
        total_active: (totalActiveStaff as any)?.count || 0,
        online_now: 0, // TODO: Track last activity
        top_performers: []
      }
    }

    return c.json({ success: true, data: stats })
  } catch (error) {
    console.error('CRM Dashboard Error:', error)
    return c.json({ success: false, message: 'Failed to load dashboard data' }, 500)
  }
})

/**
 * GET /api/crm/activity
 * Returns recent activity logs
 */
app.get('/activity', async (c) => {
  try {
    const { DB } = c.env
    const limit = parseInt(c.req.query('limit') || '20')

    // Get recent activity logs
    const activities = await DB.prepare(`
      SELECT 
        al.id,
        al.action,
        al.action_category,
        al.resource_type,
        al.resource_id,
        al.resource_name,
        al.description,
        al.severity,
        al.created_at,
        au.full_name as staff_name,
        au.avatar_url as staff_avatar
      FROM activity_logs al
      LEFT JOIN admin_users au ON al.staff_id = au.id
      ORDER BY al.created_at DESC
      LIMIT ?
    `).bind(limit).all()

    return c.json({ 
      success: true, 
      data: activities.results || [],
      meta: { total: activities.results?.length || 0 }
    })
  } catch (error) {
    console.error('Activity Log Error:', error)
    return c.json({ success: false, message: 'Failed to load activity logs' }, 500)
  }
})

/**
 * GET /api/crm/tasks
 * Returns tasks for current admin
 */
app.get('/tasks', async (c) => {
  try {
    const { DB } = c.env
    
    // For now, return empty tasks until auth is implemented
    const tasks: StaffTask[] = []

    return c.json({ 
      success: true, 
      data: tasks,
      meta: { total: 0 }
    })
  } catch (error) {
    console.error('Tasks Error:', error)
    return c.json({ success: false, message: 'Failed to load tasks' }, 500)
  }
})

/**
 * GET /api/crm/notifications
 * Returns unread notifications for current admin
 */
app.get('/notifications', async (c) => {
  try {
    const { DB } = c.env
    const limit = parseInt(c.req.query('limit') || '10')

    // Get recent notifications (for all admins for now)
    const notifications = await DB.prepare(`
      SELECT *
      FROM notifications
      WHERE is_read = 0
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(limit).all()

    return c.json({ 
      success: true, 
      data: notifications.results || [],
      meta: { total: notifications.results?.length || 0 }
    })
  } catch (error) {
    console.error('Notifications Error:', error)
    return c.json({ success: false, message: 'Failed to load notifications' }, 500)
  }
})

/**
 * POST /api/crm/activity/log
 * Create a new activity log entry
 */
app.post('/activity/log', async (c) => {
  try {
    const { DB } = c.env
    const body = await c.req.json()

    const { 
      action, 
      action_category, 
      resource_type, 
      resource_id, 
      resource_name, 
      description,
      severity = 'info',
      staff_id = null,
      changes = null,
      metadata = null
    } = body

    // Validation
    if (!action || !action_category || !resource_type || !description) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }

    // Get request metadata
    const ip_address = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || null
    const user_agent = c.req.header('User-Agent') || null

    // Insert activity log
    const result = await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, action_category, resource_type, resource_id, resource_name,
        description, changes, metadata, ip_address, user_agent, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      staff_id,
      action,
      action_category,
      resource_type,
      resource_id,
      resource_name,
      description,
      changes ? JSON.stringify(changes) : null,
      metadata ? JSON.stringify(metadata) : null,
      ip_address,
      user_agent,
      severity
    ).run()

    return c.json({ 
      success: true, 
      message: 'Activity logged successfully',
      data: { id: result.meta.last_row_id }
    })
  } catch (error) {
    console.error('Activity Log Creation Error:', error)
    return c.json({ success: false, message: 'Failed to log activity' }, 500)
  }
})

/**
 * GET /api/crm/stats/quick
 * Returns quick stats for dashboard widgets
 */
app.get('/stats/quick', async (c) => {
  try {
    const { DB } = c.env
    const today = new Date().toISOString().split('T')[0]

    // Quick parallel queries for dashboard widgets
    const [
      pendingKYC,
      pendingWithdrawals,
      activeUsers,
      newUsersToday
    ] = await Promise.all([
      DB.prepare('SELECT COUNT(*) as count FROM kyc_submissions WHERE review_status = ?').bind('pending').first(),
      DB.prepare('SELECT COUNT(*) as count FROM withdrawals WHERE status = ?').bind('pending').first(),
      DB.prepare('SELECT COUNT(*) as count FROM users WHERE account_status = ?').bind('active').first(),
      DB.prepare('SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?').bind(today).first()
    ])

    return c.json({
      success: true,
      data: {
        pending_kyc: (pendingKYC as any)?.count || 0,
        pending_withdrawals: (pendingWithdrawals as any)?.count || 0,
        active_users: (activeUsers as any)?.count || 0,
        new_users_today: (newUsersToday as any)?.count || 0
      }
    })
  } catch (error) {
    console.error('Quick Stats Error:', error)
    return c.json({ success: false, message: 'Failed to load quick stats' }, 500)
  }
})

export default app
