/**
 * Leads Management API Routes
 * Complete lead pipeline and conversion tracking
 */

import { Hono } from 'hono'
import { requireAuth, requireAdmin, requireCRMAccess } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// No middleware needed here - already applied globally in index.tsx line 162
// app.use('*', requireCRMAccess) is redundant

/**
 * GET /api/crm/leads/pipeline
 * Get leads organized by pipeline stage
 */
app.get('/pipeline', async (c) => {
  const { DB } = c.env
  
  console.log('[LEADS] 📊 Fetching pipeline data...')
  
  const assigned_to = c.req.query('assigned_to') || ''
  const source = c.req.query('source') || ''

  try {
    let whereClause = '1=1'
    const params: any[] = []
    
    if (assigned_to) {
      whereClause += ' AND l.assigned_to = ?'
      params.push(parseInt(assigned_to))
    }
    
    if (source) {
      whereClause += ' AND l.source = ?'
      params.push(source)
    }

    console.log('[LEADS] 🔍 Where clause:', whereClause)
    console.log('[LEADS] 📝 Params:', params)

    const leadsQuery = `
      SELECT 
        l.*,
        au.full_name as assigned_to_name,
        creator.full_name as created_by_name
      FROM leads l
      LEFT JOIN admin_users au ON l.assigned_to = au.id
      LEFT JOIN admin_users creator ON l.created_by = creator.id
      WHERE ${whereClause}
      ORDER BY l.score DESC, l.created_at DESC
    `
    
    console.log('[LEADS] 🗄️ Executing query...')
    const leads = await DB.prepare(leadsQuery).bind(...params).all()
    console.log('[LEADS] ✅ Query successful! Found', leads.results?.length || 0, 'leads')

    // Organize by status
    const pipeline = {
      new: [],
      qualified: [],
      contacted: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: []
    }

    for (const lead of leads.results || []) {
      const l = lead as any
      const status = l.status || 'new'
      if (pipeline[status as keyof typeof pipeline]) {
        pipeline[status as keyof typeof pipeline].push(l)
      }
    }

    return c.json({
      success: true,
      data: pipeline
    })
  } catch (error: any) {
    console.error('[LEADS] ❌ Error fetching pipeline:', error)
    console.error('[LEADS] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return c.json({
      success: false,
      error: 'Failed to fetch pipeline',
      details: error.message,
      errorType: error.name
    }, 500)
  }
})

/**
 * GET /api/crm/leads/list
 * Get all leads with filtering
 */
app.get('/list', async (c) => {
  const { DB } = c.env
  
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit
  
  const status = c.req.query('status') || ''
  const source = c.req.query('source') || ''
  const assigned_to = c.req.query('assigned_to') || ''
  const search = c.req.query('search') || ''
  const min_score = c.req.query('min_score') || ''

  try {
    const conditions: string[] = ['1=1']
    const params: any[] = []
    
    if (status) {
      conditions.push('l.status = ?')
      params.push(status)
    }
    
    if (source) {
      conditions.push('l.source = ?')
      params.push(source)
    }
    
    if (assigned_to) {
      conditions.push('l.assigned_to = ?')
      params.push(parseInt(assigned_to))
    }
    
    if (search) {
      conditions.push('(l.first_name LIKE ? OR l.last_name LIKE ? OR l.email LIKE ? OR l.company LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }
    
    if (min_score) {
      conditions.push('l.score >= ?')
      params.push(parseInt(min_score))
    }
    
    const whereClause = conditions.join(' AND ')

    // Count
    const countQuery = `SELECT COUNT(*) as total FROM leads l WHERE ${whereClause}`
    const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>()
    const total = countResult?.total || 0

    // Get leads
    const leadsQuery = `
      SELECT 
        l.*,
        au.full_name as assigned_to_name,
        creator.full_name as created_by_name
      FROM leads l
      LEFT JOIN admin_users au ON l.assigned_to = au.id
      LEFT JOIN admin_users creator ON l.created_by = creator.id
      WHERE ${whereClause}
      ORDER BY l.score DESC, l.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const leads = await DB.prepare(leadsQuery).bind(...params, limit, offset).all()

    return c.json({
      success: true,
      data: {
        leads: leads.results || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('Error fetching leads:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch leads',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/leads/:id
 * Get single lead details
 */
app.get('/:id', async (c) => {
  const { DB } = c.env
  const leadId = c.req.param('id')

  try {
    const lead = await DB.prepare(`
      SELECT 
        l.*,
        au.full_name as assigned_to_name,
        au.email as assigned_to_email,
        creator.full_name as created_by_name,
        qualifier.full_name as qualified_by_name
      FROM leads l
      LEFT JOIN admin_users au ON l.assigned_to = au.id
      LEFT JOIN admin_users creator ON l.created_by = creator.id
      LEFT JOIN admin_users qualifier ON l.qualified_by = qualifier.id
      WHERE l.id = ?
    `).bind(leadId).first()

    if (!lead) {
      return c.json({
        success: false,
        error: 'Lead not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: lead
    })
  } catch (error: any) {
    console.error('Error fetching lead:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch lead',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/leads/create
 * Create new lead
 */
app.post('/create', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')

  console.log('[LEAD CREATE] adminUser:', JSON.stringify(adminUser, null, 2))
  
  if (!adminUser || !adminUser.id) {
    console.error('[LEAD CREATE] ❌ No adminUser found in context')
    return c.json({
      success: false,
      error: 'Authentication error: admin user not found'
    }, 500)
  }

  try {
    const body = await c.req.json()
    console.log('[LEAD CREATE] Request body:', JSON.stringify(body, null, 2))
    
    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      job_title,
      source,
      status = 'new',
      score = 0,
      assigned_to,
      estimated_value,
      tags,
      notes
    } = body

    console.log('[LEAD CREATE] Parsed fields:', { first_name, last_name, email, source, status, score })

    if (!first_name || !email || !source) {
      return c.json({
        success: false,
        error: 'First name, email, and source are required'
      }, 400)
    }

    const result = await DB.prepare(`
      INSERT INTO leads (
        first_name, last_name, email, phone, company, job_title,
        source, status, stage, score, assigned_to, estimated_value,
        tags, notes, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      first_name,
      last_name || null,
      email,
      phone || null,
      company || null,
      job_title || null,
      source,
      status,
      status, // stage matches status initially
      score,
      assigned_to || null,
      estimated_value || null,
      tags || null,
      notes || null,
      adminUser.id
    ).run()

    // Log activity
    await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, resource_type, resource_id, description, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      adminUser.id,
      'lead_created',
      'lead',
      result.meta.last_row_id,
      `Created lead: ${first_name} ${last_name || ''} (${email})`,
      'info'
    ).run()

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: 'Lead created successfully'
      }
    })
  } catch (error: any) {
    console.error('[LEAD CREATE ERROR]', error)
    console.error('[LEAD CREATE ERROR] Stack:', error.stack)
    console.error('[LEAD CREATE ERROR] Message:', error.message)
    return c.json({
      success: false,
      error: 'Failed to create lead',
      details: error.message,
      stack: error.stack
    }, 500)
  }
})

/**
 * PUT /api/crm/leads/:id
 * Update lead
 */
app.put('/:id', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const leadId = c.req.param('id')

  try {
    const body = await c.req.json()

    // Build update query
    const updates: string[] = []
    const params: any[] = []

    const fields = ['first_name', 'last_name', 'email', 'phone', 'company', 'job_title', 
                   'source', 'status', 'score', 'assigned_to', 'estimated_value', 'tags', 'notes']

    for (const field of fields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`)
        params.push(body[field] || null)
      }
    }

    if (updates.length === 0) {
      return c.json({
        success: false,
        error: 'No fields to update'
      }, 400)
    }

    updates.push('updated_at = datetime("now")')
    params.push(leadId)

    await DB.prepare(`
      UPDATE leads SET ${updates.join(', ')} WHERE id = ?
    `).bind(...params).run()

    // Log activity
    await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, resource_type, resource_id, description, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      adminUser.id,
      'lead_updated',
      'lead',
      leadId,
      `Updated lead #${leadId}`,
      'info'
    ).run()

    return c.json({
      success: true,
      message: 'Lead updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating lead:', error)
    return c.json({
      success: false,
      error: 'Failed to update lead',
      details: error.message
    }, 500)
  }
})

/**
 * PUT /api/crm/leads/:id/status
 * Update lead status (for pipeline drag & drop)
 */
app.put('/:id/status', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const leadId = c.req.param('id')

  try {
    const body = await c.req.json()
    const { status } = body

    if (!status) {
      return c.json({
        success: false,
        error: 'Status is required'
      }, 400)
    }

    await DB.prepare(`
      UPDATE leads
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, leadId).run()

    // Log activity
    await DB.prepare(`
      INSERT INTO lead_activities (
        lead_id, activity_type, title, description, performed_by, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      leadId,
      'status_change',
      'Status Changed',
      `Status changed to: ${status}`,
      adminUser.id
    ).run()

    return c.json({
      success: true,
      message: 'Lead status updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating lead status:', error)
    return c.json({
      success: false,
      error: 'Failed to update lead status',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/leads/:id/qualify
 * Qualify a lead
 */
app.post('/:id/qualify', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const leadId = c.req.param('id')

  try {
    await DB.prepare(`
      UPDATE leads
      SET is_qualified = 1, qualified_at = datetime('now'),
          qualified_by = ?, status = 'qualified', updated_at = datetime('now')
      WHERE id = ?
    `).bind(adminUser.id, leadId).run()

    // Log activity
    await DB.prepare(`
      INSERT INTO lead_activities (
        lead_id, activity_type, title, description, performed_by, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      leadId,
      'qualification',
      'Lead Qualified',
      `Lead qualified by ${adminUser.full_name || adminUser.username}`,
      adminUser.id
    ).run()

    return c.json({
      success: true,
      message: 'Lead qualified successfully'
    })
  } catch (error: any) {
    console.error('Error qualifying lead:', error)
    return c.json({
      success: false,
      error: 'Failed to qualify lead',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/leads/:id/convert
 * Convert lead to customer
 */
app.post('/:id/convert', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const leadId = c.req.param('id')

  try {
    const body = await c.req.json()
    const { user_id } = body // Optional: link to existing user

    await DB.prepare(`
      UPDATE leads
      SET is_converted = 1, converted_at = datetime('now'),
          converted_to_user_id = ?, status = 'won', updated_at = datetime('now')
      WHERE id = ?
    `).bind(user_id || null, leadId).run()

    // Log activity
    await DB.prepare(`
      INSERT INTO lead_activities (
        lead_id, activity_type, title, description, performed_by, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      leadId,
      'conversion',
      'Lead Converted',
      `Lead converted to customer`,
      adminUser.id
    ).run()

    return c.json({
      success: true,
      message: 'Lead converted successfully'
    })
  } catch (error: any) {
    console.error('Error converting lead:', error)
    return c.json({
      success: false,
      error: 'Failed to convert lead',
      details: error.message
    }, 500)
  }
})

/**
 * DELETE /api/crm/leads/:id
 * Delete lead
 */
app.delete('/:id', async (c) => {
  const { DB } = c.env
  const leadId = c.req.param('id')

  try {
    await DB.prepare('DELETE FROM leads WHERE id = ?').bind(leadId).run()

    return c.json({
      success: true,
      message: 'Lead deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting lead:', error)
    return c.json({
      success: false,
      error: 'Failed to delete lead',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/leads/:id/activities
 * Get lead activities
 */
app.get('/:id/activities', async (c) => {
  const { DB } = c.env
  const leadId = c.req.param('id')

  try {
    const activities = await DB.prepare(`
      SELECT 
        la.*,
        au.full_name as performed_by_name
      FROM lead_activities la
      LEFT JOIN admin_users au ON la.performed_by = au.id
      WHERE la.lead_id = ?
      ORDER BY la.created_at DESC
    `).bind(leadId).all()

    return c.json({
      success: true,
      data: activities.results || []
    })
  } catch (error: any) {
    console.error('Error fetching activities:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch activities',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/leads/:id/activities
 * Add activity to lead
 */
app.post('/:id/activities', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const leadId = c.req.param('id')

  try {
    const body = await c.req.json()
    const { activity_type, title, description, outcome, duration_minutes } = body

    if (!activity_type || !title) {
      return c.json({
        success: false,
        error: 'Activity type and title are required'
      }, 400)
    }

    const result = await DB.prepare(`
      INSERT INTO lead_activities (
        lead_id, activity_type, title, description, outcome,
        duration_minutes, performed_by, completed_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      leadId,
      activity_type,
      title,
      description || null,
      outcome || null,
      duration_minutes || null,
      adminUser.id
    ).run()

    // Update last_contact_at
    await DB.prepare(`
      UPDATE leads SET last_contact_at = datetime('now') WHERE id = ?
    `).bind(leadId).run()

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: 'Activity added successfully'
      }
    })
  } catch (error: any) {
    console.error('Error adding activity:', error)
    return c.json({
      success: false,
      error: 'Failed to add activity',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/leads/stats
 * Get lead statistics
 */
app.get('/stats', async (c) => {
  const { DB } = c.env

  try {
    // By status
    const byStatus = await DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM leads
      GROUP BY status
    `).all()

    // By source
    const bySource = await DB.prepare(`
      SELECT source, COUNT(*) as count
      FROM leads
      GROUP BY source
      ORDER BY count DESC
    `).all()

    // Conversion rate
    const conversionData = await DB.prepare(`
      SELECT 
        COUNT(*) as total_leads,
        SUM(CASE WHEN is_converted = 1 THEN 1 ELSE 0 END) as converted_leads,
        SUM(CASE WHEN is_qualified = 1 THEN 1 ELSE 0 END) as qualified_leads
      FROM leads
    `).first()

    // Average score
    const avgScore = await DB.prepare(`
      SELECT AVG(score) as avg_score
      FROM leads
    `).first()

    return c.json({
      success: true,
      data: {
        byStatus: byStatus.results || [],
        bySource: bySource.results || [],
        conversionRate: (conversionData as any)?.converted_leads / (conversionData as any)?.total_leads * 100 || 0,
        qualificationRate: (conversionData as any)?.qualified_leads / (conversionData as any)?.total_leads * 100 || 0,
        averageScore: (avgScore as any)?.avg_score || 0,
        totalLeads: (conversionData as any)?.total_leads || 0,
        convertedLeads: (conversionData as any)?.converted_leads || 0
      }
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch statistics',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/leads/sources
 * Get all lead sources
 */
app.get('/sources', async (c) => {
  const { DB } = c.env

  try {
    const sources = await DB.prepare(`
      SELECT * FROM lead_sources WHERE is_active = 1 ORDER BY name
    `).all()

    return c.json({
      success: true,
      data: sources.results || []
    })
  } catch (error: any) {
    return c.json({
      success: false,
      error: 'Failed to fetch sources'
    }, 500)
  }
})

/**
 * GET /api/crm/leads/tags
 * Get all lead tags
 */
app.get('/tags', async (c) => {
  const { DB } = c.env

  try {
    const tags = await DB.prepare(`
      SELECT * FROM lead_tags ORDER BY name
    `).all()

    return c.json({
      success: true,
      data: tags.results || []
    })
  } catch (error: any) {
    return c.json({
      success: false,
      error: 'Failed to fetch tags'
    }, 500)
  }
})

export default app
