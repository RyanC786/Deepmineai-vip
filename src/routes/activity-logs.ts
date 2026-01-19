/**
 * Activity Logs API Routes
 * Comprehensive activity tracking and audit trail system
 */

import { Hono } from 'hono'
import { requireAuth, requireAdmin, requireCRMAccess } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Apply CRM auth middleware to all routes (allows both Super Admins and CRM staff)
app.use('*', requireCRMAccess)

/**
 * GET /api/crm/activity-logs/list
 * Get paginated activity logs with filters
 */
app.get('/list', async (c) => {
  const { DB } = c.env
  
  // Query parameters
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit
  
  const actor = c.req.query('actor') || ''
  const action = c.req.query('action') || ''
  const resource = c.req.query('resource') || ''
  const startDate = c.req.query('start_date') || ''
  const endDate = c.req.query('end_date') || ''

  try {
    // Build WHERE clause
    const conditions: string[] = ['1=1']
    const params: any[] = []
    
    if (actor) {
      conditions.push('(s.full_name LIKE ? OR s.email LIKE ?)')
      params.push(`%${actor}%`, `%${actor}%`)
    }
    
    if (action) {
      conditions.push('al.action LIKE ?')
      params.push(`%${action}%`)
    }
    
    if (resource) {
      conditions.push('al.resource_type LIKE ?')
      params.push(`%${resource}%`)
    }
    
    if (startDate) {
      conditions.push('al.created_at >= ?')
      params.push(startDate)
    }
    
    if (endDate) {
      conditions.push('al.created_at <= ?')
      params.push(endDate + ' 23:59:59')
    }
    
    const whereClause = conditions.join(' AND ')

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM activity_logs al
      WHERE ${whereClause}
    `
    const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>()
    const total = countResult?.total || 0

    // Get logs
    const logsQuery = `
      SELECT 
        al.*,
        s.full_name as actor_name,
        s.email as actor_email
      FROM activity_logs al
      LEFT JOIN crm_staff s ON al.staff_id = s.id
      WHERE ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const logs = await DB.prepare(logsQuery)
      .bind(...params, limit, offset)
      .all()

    return c.json({
      success: true,
      data: {
        logs: logs.results || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('Error fetching activity logs:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch activity logs',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/activity-logs/detail/:id
 * Get single activity log details
 * NOTE: Moved from /:id to avoid catching /stats, /list, etc.
 */
app.get('/detail/:id', async (c) => {
  const { DB } = c.env
  const logId = c.req.param('id')

  try {
    const log = await DB.prepare(`
      SELECT 
        al.*,
        s.full_name as actor_name,
        s.email as actor_email
      FROM activity_logs al
      LEFT JOIN crm_staff s ON al.staff_id = s.id
      WHERE al.id = ?
    `).bind(logId).first()

    if (!log) {
      return c.json({
        success: false,
        error: 'Activity log not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: log
    })
  } catch (error: any) {
    console.error('Error fetching activity log:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch activity log',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/activity-logs/user/:userId
 * Get activity logs for specific user
 */
app.get('/user/:userId', async (c) => {
  const { DB } = c.env
  const userId = c.req.param('userId')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  try {
    // Get total count
    const countResult = await DB.prepare(`
      SELECT COUNT(*) as total
      FROM activity_logs
      WHERE resource_type = 'user' AND resource_id = ?
    `).bind(userId).first<{ total: number }>()
    
    const total = countResult?.total || 0

    // Get logs
    const logs = await DB.prepare(`
      SELECT 
        al.*,
        s.full_name as actor_name,
        s.email as actor_email
      FROM activity_logs al
      LEFT JOIN crm_staff s ON al.staff_id = s.id
      WHERE al.resource_type = 'user' AND al.resource_id = ?
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all()

    return c.json({
      success: true,
      data: {
        logs: logs.results || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('Error fetching user activity logs:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch user activity logs',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/activity-logs/staff/:staffId
 * Get activity logs for specific staff member
 */
app.get('/staff/:staffId', async (c) => {
  const { DB } = c.env
  const staffId = c.req.param('staffId')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  try {
    // Get total count
    const countResult = await DB.prepare(`
      SELECT COUNT(*) as total
      FROM activity_logs
      WHERE staff_id = ? OR (resource_type = 'staff' AND resource_id = ?)
    `).bind(staffId, staffId).first<{ total: number }>()
    
    const total = countResult?.total || 0

    // Get logs
    const logs = await DB.prepare(`
      SELECT 
        al.*,
        s.full_name as actor_name,
        s.email as actor_email
      FROM activity_logs al
      LEFT JOIN crm_staff s ON al.staff_id = s.id
      WHERE al.staff_id = ? OR (al.resource_type = 'staff' AND al.resource_id = ?)
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(staffId, staffId, limit, offset).all()

    return c.json({
      success: true,
      data: {
        logs: logs.results || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('Error fetching staff activity logs:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch staff activity logs',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/activity-logs/stats
 * Get activity statistics
 */
app.get('/stats', async (c) => {
  const { DB } = c.env
  const days = parseInt(c.req.query('days') || '7')

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0]

    // Total activities
    const totalResult = await DB.prepare(`
      SELECT COUNT(*) as total
      FROM activity_logs
      WHERE created_at >= ?
    `).bind(cutoffDateStr).first<{ total: number }>()

    // Activities by action
    const byAction = await DB.prepare(`
      SELECT action, COUNT(*) as count
      FROM activity_logs
      WHERE created_at >= ?
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `).bind(cutoffDateStr).all()

    // Activities by resource type
    const byResource = await DB.prepare(`
      SELECT resource_type, COUNT(*) as count
      FROM activity_logs
      WHERE created_at >= ?
      GROUP BY resource_type
      ORDER BY count DESC
    `).bind(cutoffDateStr).all()

    // Top actors
    const topActors = await DB.prepare(`
      SELECT 
        s.full_name as actor_name,
        COUNT(*) as count
      FROM activity_logs al
      LEFT JOIN crm_staff s ON al.staff_id = s.id
      WHERE al.created_at >= ? AND al.staff_id IS NOT NULL
      GROUP BY al.staff_id, s.full_name
      ORDER BY count DESC
      LIMIT 10
    `).bind(cutoffDateStr).all()

    // Daily activity
    const dailyActivity = await DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM activity_logs
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).bind(cutoffDateStr).all()

    return c.json({
      success: true,
      data: {
        total: totalResult?.total || 0,
        byAction: byAction.results || [],
        byResource: byResource.results || [],
        topActors: topActors.results || [],
        dailyActivity: dailyActivity.results || [],
        period: `Last ${days} days`
      }
    })
  } catch (error: any) {
    console.error('Error fetching activity stats:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch activity statistics',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/activity-logs/create
 * Create new activity log (for manual logging)
 */
app.post('/create', requireAdmin, async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')

  try {
    const body = await c.req.json()
    const { action, resource_type, resource_id, details, metadata } = body

    if (!action || !resource_type) {
      return c.json({
        success: false,
        error: 'Action and resource_type are required'
      }, 400)
    }

    const result = await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, resource_type, resource_id,
        description, severity, metadata,
        ip_address, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      adminUser.id,
      action,
      resource_type,
      resource_id || null,
      details || `${action} on ${resource_type}`,
      'info',
      metadata ? JSON.stringify(metadata) : null,
      c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || null,
      c.req.header('user-agent') || null
    ).run()

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: 'Activity log created successfully'
      }
    })
  } catch (error: any) {
    console.error('Error creating activity log:', error)
    return c.json({
      success: false,
      error: 'Failed to create activity log',
      details: error.message
    }, 500)
  }
})

/**
 * DELETE /api/crm/activity-logs/:id
 * Delete activity log (admin only, for GDPR compliance)
 */
app.delete('/:id', requireAdmin, async (c) => {
  const { DB } = c.env
  const logId = c.req.param('id')

  try {
    const result = await DB.prepare(`
      DELETE FROM activity_logs
      WHERE id = ?
    `).bind(logId).run()

    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: 'Activity log not found'
      }, 404)
    }

    return c.json({
      success: true,
      message: 'Activity log deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting activity log:', error)
    return c.json({
      success: false,
      error: 'Failed to delete activity log',
      details: error.message
    }, 500)
  }
})

export default app
