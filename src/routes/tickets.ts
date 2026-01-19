import { Hono } from 'hono'

const app = new Hono()

/**
 * Generate unique ticket number
 */
function generateTicketNumber(id: number): string {
  const year = new Date().getFullYear()
  const paddedId = String(id).padStart(4, '0')
  return `TKT-${year}-${paddedId}`
}

// ============================================
// PUBLIC USER ENDPOINTS (No auth required)
// ============================================

/**
 * POST /api/tickets/create
 * Create new support ticket (public endpoint for users/AI assistant)
 */
app.post('/create', async (c) => {
  const { DB } = c.env
  
  try {
    const body = await c.req.json()
    const {
      subject,
      description,
      customer_name,
      customer_email,
      priority = 'medium',
      category = 'general',
      user_id
    } = body
    
    // Validate required fields
    if (!subject || !description) {
      return c.json({
        success: false,
        error: 'Subject and description are required'
      }, 400)
    }
    
    if (!customer_email) {
      return c.json({
        success: false,
        error: 'Email is required'
      }, 400)
    }
    
    // Create ticket
    const result = await DB.prepare(`
      INSERT INTO support_tickets (
        ticket_number, subject, description, user_id,
        customer_name, customer_email, priority, category,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      'TEMP', // Will update with real ticket number
      subject,
      description,
      user_id || null,
      customer_name || 'Guest',
      customer_email,
      priority,
      category,
      'open'
    ).run()
    
    const ticketId = result.meta.last_row_id
    const ticketNumber = generateTicketNumber(ticketId)
    
    // Update ticket number
    await DB.prepare(`
      UPDATE support_tickets SET ticket_number = ? WHERE id = ?
    `).bind(ticketNumber, ticketId).run()
    
    return c.json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        id: ticketId,
        ticket_number: ticketNumber
      }
    })
  } catch (error: any) {
    console.error('[TICKETS] Error creating public ticket:', error)
    return c.json({
      success: false,
      error: 'Failed to create ticket',
      message: 'Please try again or contact support@deepmineai.vip',
      details: error.message
    }, 500)
  }
})

// ============================================
// CRM/ADMIN ENDPOINTS (Require auth)
// ============================================

/**
 * GET /api/crm/tickets/list
 * Get paginated list of tickets with filters
 */
app.get('/list', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const status = c.req.query('status') || ''
  const priority = c.req.query('priority') || ''
  const assigned_to = c.req.query('assigned_to') || ''
  const search = c.req.query('search') || ''
  
  const offset = (page - 1) * limit
  
  try {
    let whereClause = '1=1'
    const params: any[] = []
    
    if (status) {
      whereClause += ' AND t.status = ?'
      params.push(status)
    }
    
    if (priority) {
      whereClause += ' AND t.priority = ?'
      params.push(priority)
    }
    
    if (assigned_to) {
      whereClause += ' AND t.assigned_to = ?'
      params.push(parseInt(assigned_to))
    }
    
    if (search) {
      whereClause += ' AND (t.ticket_number LIKE ? OR t.subject LIKE ? OR t.customer_email LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }
    
    // Get total count
    const countResult = await DB.prepare(`
      SELECT COUNT(*) as total FROM support_tickets t WHERE ${whereClause}
    `).bind(...params).first()
    
    const total = countResult?.total || 0
    
    // Get tickets
    const tickets = await DB.prepare(`
      SELECT 
        t.*,
        assignee.full_name as assigned_to_name,
        creator.full_name as created_by_name,
        (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as message_count,
        (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id AND is_internal = 0) as public_message_count
      FROM support_tickets t
      LEFT JOIN admin_users assignee ON t.assigned_to = assignee.id
      LEFT JOIN admin_users creator ON t.created_by = creator.id
      WHERE ${whereClause}
      ORDER BY 
        CASE WHEN t.priority = 'urgent' THEN 1
             WHEN t.priority = 'high' THEN 2
             WHEN t.priority = 'medium' THEN 3
             ELSE 4 END,
        t.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()
    
    return c.json({
      success: true,
      data: {
        tickets: tickets.results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('[TICKETS] Error listing tickets:', error)
    return c.json({
      success: false,
      error: 'Failed to list tickets',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/tickets/:id
 * Get single ticket with messages
 */
app.get('/:id', async (c) => {
  const { DB } = c.env
  const ticketId = c.req.param('id')
  
  try {
    // Get ticket details
    const ticket = await DB.prepare(`
      SELECT 
        t.*,
        assignee.full_name as assigned_to_name,
        assignee.email as assigned_to_email,
        creator.full_name as created_by_name
      FROM support_tickets t
      LEFT JOIN admin_users assignee ON t.assigned_to = assignee.id
      LEFT JOIN admin_users creator ON t.created_by = creator.id
      WHERE t.id = ?
    `).bind(ticketId).first()
    
    if (!ticket) {
      return c.json({
        success: false,
        error: 'Ticket not found'
      }, 404)
    }
    
    // Get messages
    const messages = await DB.prepare(`
      SELECT * FROM ticket_messages
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `).bind(ticketId).all()
    
    return c.json({
      success: true,
      data: {
        ticket,
        messages: messages.results
      }
    })
  } catch (error: any) {
    console.error('[TICKETS] Error getting ticket:', error)
    return c.json({
      success: false,
      error: 'Failed to get ticket',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/tickets/create
 * Create new ticket
 */
app.post('/create', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  
  try {
    const body = await c.req.json()
    const {
      subject,
      description,
      user_id,
      customer_name,
      customer_email,
      priority = 'medium',
      category,
      assigned_to
    } = body
    
    if (!subject || !description) {
      return c.json({
        success: false,
        error: 'Subject and description are required'
      }, 400)
    }
    
    if (!customer_email) {
      return c.json({
        success: false,
        error: 'Customer email is required'
      }, 400)
    }
    
    // Create ticket
    const result = await DB.prepare(`
      INSERT INTO support_tickets (
        ticket_number, subject, description, user_id,
        customer_name, customer_email, priority, category,
        assigned_to, assigned_at, status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      'TEMP', // Will update with real ticket number
      subject,
      description,
      user_id || null,
      customer_name || null,
      customer_email,
      priority,
      category || null,
      assigned_to || null,
      assigned_to ? `datetime('now')` : null,
      'open',
      adminUser?.id || null
    ).run()
    
    const ticketId = result.meta.last_row_id
    const ticketNumber = generateTicketNumber(ticketId)
    
    // Update ticket number
    await DB.prepare(`
      UPDATE support_tickets SET ticket_number = ? WHERE id = ?
    `).bind(ticketNumber, ticketId).run()
    
    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id, description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser?.id || null,
        'ticket_created',
        'ticket',
        ticketId,
        `Created ticket #${ticketNumber}: ${subject}`,
        'info'
      ).run()
    } catch (logError) {
      console.error('[TICKETS] Activity log failed:', logError)
    }
    
    return c.json({
      success: true,
      data: {
        id: ticketId,
        ticket_number: ticketNumber
      }
    })
  } catch (error: any) {
    console.error('[TICKETS] Error creating ticket:', error)
    return c.json({
      success: false,
      error: 'Failed to create ticket',
      details: error.message
    }, 500)
  }
})

/**
 * PUT /api/crm/tickets/:id
 * Update ticket
 */
app.put('/:id', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const ticketId = c.req.param('id')
  
  try {
    const body = await c.req.json()
    
    // Check if ticket exists
    const existingTicket = await DB.prepare('SELECT * FROM support_tickets WHERE id = ?')
      .bind(ticketId).first()
    
    if (!existingTicket) {
      return c.json({
        success: false,
        error: 'Ticket not found'
      }, 404)
    }
    
    // Build update query
    const updates: string[] = []
    const params: any[] = []
    
    const {
      subject,
      description,
      status,
      priority,
      category,
      assigned_to,
      satisfaction_rating,
      satisfaction_feedback,
      tags,
      internal_notes
    } = body
    
    if (subject !== undefined) {
      updates.push('subject = ?')
      params.push(subject)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      params.push(description)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
      
      // Update status-related timestamps
      if (status === 'resolved' && (existingTicket as any).status !== 'resolved') {
        updates.push('resolved_at = datetime("now")')
        updates.push('resolved_by = ?')
        params.push(adminUser?.id || null)
      }
      if (status === 'closed' && (existingTicket as any).status !== 'closed') {
        updates.push('closed_at = datetime("now")')
        updates.push('closed_by = ?')
        params.push(adminUser?.id || null)
      }
    }
    if (priority !== undefined) {
      updates.push('priority = ?')
      params.push(priority)
    }
    if (category !== undefined) {
      updates.push('category = ?')
      params.push(category || null)
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?')
      params.push(assigned_to || null)
      
      if (assigned_to && !(existingTicket as any).assigned_at) {
        updates.push('assigned_at = datetime("now")')
      }
    }
    if (satisfaction_rating !== undefined) {
      updates.push('satisfaction_rating = ?')
      params.push(satisfaction_rating || null)
    }
    if (satisfaction_feedback !== undefined) {
      updates.push('satisfaction_feedback = ?')
      params.push(satisfaction_feedback || null)
    }
    if (tags !== undefined) {
      updates.push('tags = ?')
      params.push(tags || null)
    }
    if (internal_notes !== undefined) {
      updates.push('internal_notes = ?')
      params.push(internal_notes || null)
    }
    
    updates.push('updated_at = datetime("now")')
    params.push(ticketId)
    
    await DB.prepare(`
      UPDATE support_tickets
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run()
    
    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id,
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser?.id || null,
        'ticket_updated',
        'ticket',
        ticketId,
        `Updated ticket #${(existingTicket as any).ticket_number}`,
        'info'
      ).run()
    } catch (logError) {
      console.error('[TICKETS] Activity log failed:', logError)
    }
    
    return c.json({
      success: true,
      message: 'Ticket updated successfully'
    })
  } catch (error: any) {
    console.error('[TICKETS] Error updating ticket:', error)
    return c.json({
      success: false,
      error: 'Failed to update ticket',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/tickets/:id/messages
 * Add message to ticket
 */
app.post('/:id/messages', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const ticketId = c.req.param('id')
  
  try {
    const body = await c.req.json()
    const { message, is_internal = false } = body
    
    if (!message || !message.trim()) {
      return c.json({
        success: false,
        error: 'Message is required'
      }, 400)
    }
    
    // Check if ticket exists
    const ticket = await DB.prepare('SELECT * FROM support_tickets WHERE id = ?')
      .bind(ticketId).first()
    
    if (!ticket) {
      return c.json({
        success: false,
        error: 'Ticket not found'
      }, 404)
    }
    
    // Insert message
    const result = await DB.prepare(`
      INSERT INTO ticket_messages (
        ticket_id, message, is_internal, author_type, author_id,
        author_name, author_email, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      ticketId,
      message.trim(),
      is_internal ? 1 : 0,
      'staff',
      adminUser?.id || null,
      adminUser?.full_name || 'System',
      adminUser?.email || null
    ).run()
    
    // Update ticket's updated_at timestamp
    await DB.prepare(`
      UPDATE support_tickets SET updated_at = datetime('now') WHERE id = ?
    `).bind(ticketId).run()
    
    // Update first_response_at if this is the first staff response
    if (!(ticket as any).first_response_at && !is_internal) {
      await DB.prepare(`
        UPDATE support_tickets SET first_response_at = datetime('now') WHERE id = ?
      `).bind(ticketId).run()
    }
    
    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id,
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser?.id || null,
        'ticket_message_added',
        'ticket',
        ticketId,
        `Added ${is_internal ? 'internal' : 'public'} message to ticket #${(ticket as any).ticket_number}`,
        'info'
      ).run()
    } catch (logError) {
      console.error('[TICKETS] Activity log failed:', logError)
    }
    
    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id
      }
    })
  } catch (error: any) {
    console.error('[TICKETS] Error adding message:', error)
    return c.json({
      success: false,
      error: 'Failed to add message',
      details: error.message
    }, 500)
  }
})

/**
 * DELETE /api/crm/tickets/:id
 * Delete ticket (and all its messages)
 */
app.delete('/:id', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const ticketId = c.req.param('id')
  
  try {
    // Check if ticket exists
    const ticket = await DB.prepare('SELECT * FROM support_tickets WHERE id = ?')
      .bind(ticketId).first()
    
    if (!ticket) {
      return c.json({
        success: false,
        error: 'Ticket not found'
      }, 404)
    }
    
    // Delete all messages first (foreign key cascade should handle this, but being explicit)
    await DB.prepare('DELETE FROM ticket_messages WHERE ticket_id = ?')
      .bind(ticketId).run()
    
    // Delete the ticket
    await DB.prepare('DELETE FROM support_tickets WHERE id = ?')
      .bind(ticketId).run()
    
    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id,
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser?.id || null,
        'ticket_deleted',
        'ticket',
        ticketId,
        `Deleted ticket #${(ticket as any).ticket_number}: ${(ticket as any).subject}`,
        'warning'
      ).run()
    } catch (logError) {
      console.error('[TICKETS] Activity log failed:', logError)
    }
    
    return c.json({
      success: true,
      message: 'Ticket deleted successfully'
    })
  } catch (error: any) {
    console.error('[TICKETS] Error deleting ticket:', error)
    return c.json({
      success: false,
      error: 'Failed to delete ticket',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/tickets/stats
 * Get ticket statistics
 */
app.get('/stats', async (c) => {
  const { DB } = c.env
  
  try {
    // Get status counts
    const statusStats = await DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM support_tickets
      GROUP BY status
    `).all()
    
    // Get priority counts
    const priorityStats = await DB.prepare(`
      SELECT priority, COUNT(*) as count
      FROM support_tickets
      WHERE status != 'closed'
      GROUP BY priority
    `).all()
    
    // Get average response time (in hours)
    const responseTime = await DB.prepare(`
      SELECT 
        AVG(JULIANDAY(first_response_at) - JULIANDAY(created_at)) * 24 as avg_hours
      FROM support_tickets
      WHERE first_response_at IS NOT NULL
    `).first()
    
    // Get average resolution time (in hours)
    const resolutionTime = await DB.prepare(`
      SELECT 
        AVG(JULIANDAY(resolved_at) - JULIANDAY(created_at)) * 24 as avg_hours
      FROM support_tickets
      WHERE resolved_at IS NOT NULL
    `).first()
    
    return c.json({
      success: true,
      data: {
        byStatus: statusStats.results,
        byPriority: priorityStats.results,
        avgResponseTime: responseTime?.avg_hours || 0,
        avgResolutionTime: resolutionTime?.avg_hours || 0
      }
    })
  } catch (error: any) {
    console.error('[TICKETS] Error getting stats:', error)
    return c.json({
      success: false,
      error: 'Failed to get statistics',
      details: error.message
    }, 500)
  }
})

export default app
