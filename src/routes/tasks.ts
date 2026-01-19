/**
 * Task Management API Routes
 * Complete task board system with assignments and comments
 */

import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Debug endpoint to check cookie visibility
app.get('/debug-auth', async (c) => {
  const adminToken = getCookie(c, 'admin_token')
  const cookieHeader = c.req.header('Cookie')
  const allHeaders = Object.fromEntries(c.req.raw.headers.entries())
  
  // Check if adminUser is set by middleware
  const adminUser = c.get('adminUser')
  const adminId = c.get('adminId')
  
  return c.json({
    debug: {
      adminTokenViaCookie: adminToken ? 'EXISTS (length: ' + adminToken.length + ')' : 'NULL',
      cookieHeaderExists: !!cookieHeader,
      cookieHeaderValue: cookieHeader || 'NONE',
      adminUserFromContext: adminUser || 'NOT SET',
      adminIdFromContext: adminId || 'NOT SET',
      allHeaders: allHeaders,
      url: c.req.url,
      method: c.req.method,
      requestType: c.req.header('Sec-Fetch-Mode') || 'unknown'
    }
  })
})

// NOTE: Auth middleware is already applied at the parent level (/api/crm/*)
// via requireCRMAccess in src/index.tsx, so we don't need to apply it here
// Removed: app.use('*', requireAuth) - this was causing 401 errors

/**
 * GET /api/crm/tasks/list
 * Get all tasks with filtering and pagination
 */
app.get('/list', async (c) => {
  const { DB } = c.env
  
  // Query parameters
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit
  
  const status = c.req.query('status') || ''
  const priority = c.req.query('priority') || ''
  const assignedTo = c.req.query('assigned_to') || ''
  const category = c.req.query('category') || ''
  const search = c.req.query('search') || ''

  try {
    // Build WHERE clause
    const conditions: string[] = ['1=1']
    const params: any[] = []
    
    if (status) {
      // Support comma-separated status values (e.g., "todo,in_progress")
      const statusList = status.split(',').map(s => s.trim()).filter(s => s)
      if (statusList.length === 1) {
        conditions.push('t.status = ?')
        params.push(statusList[0])
      } else if (statusList.length > 1) {
        const placeholders = statusList.map(() => '?').join(',')
        conditions.push(`t.status IN (${placeholders})`)
        params.push(...statusList)
      }
    }
    
    if (priority) {
      conditions.push('t.priority = ?')
      params.push(priority)
    }
    
    if (assignedTo) {
      conditions.push('t.assigned_to = ?')
      params.push(parseInt(assignedTo))
    }
    
    if (category) {
      conditions.push('t.category LIKE ?')
      params.push(`%${category}%`)
    }
    
    if (search) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }
    
    const whereClause = conditions.join(' AND ')

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM staff_tasks t
      WHERE ${whereClause}
    `
    const countResult = await DB.prepare(countQuery).bind(...params).first<{ total: number }>()
    const total = countResult?.total || 0

    // Get tasks with staff info
    const tasksQuery = `
      SELECT 
        t.*,
        creator.full_name as assigned_by_name,
        creator.email as assigned_by_email,
        assignee.full_name as assigned_to_name,
        assignee.email as assigned_to_email,
        0 as comment_count
      FROM staff_tasks t
      LEFT JOIN admin_users creator ON t.assigned_by = creator.id
      LEFT JOIN admin_users assignee ON t.assigned_to = assignee.id
      WHERE ${whereClause}
      ORDER BY 
        CASE t.priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        t.due_date ASC,
        t.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const tasks = await DB.prepare(tasksQuery)
      .bind(...params, limit, offset)
      .all()

    return c.json({
      success: true,
      data: {
        tasks: tasks.results || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    console.error('Error fetching tasks:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch tasks',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/tasks/board
 * Get tasks organized by status for Kanban board
 */
app.get('/board', async (c) => {
  const { DB } = c.env
  
  const assignedTo = c.req.query('assigned_to') || ''
  const category = c.req.query('category') || ''

  try {
    let whereClause = '1=1'
    const params: any[] = []
    
    if (assignedTo) {
      whereClause += ' AND t.assigned_to = ?'
      params.push(parseInt(assignedTo))
    }
    
    if (category) {
      whereClause += ' AND t.category LIKE ?'
      params.push(`%${category}%`)
    }

    const tasksQuery = `
      SELECT 
        t.*,
        creator.full_name as assigned_by_name,
        assignee.full_name as assigned_to_name,
        assignee.username as assigned_to_avatar,
        0 as comment_count
      FROM staff_tasks t
      LEFT JOIN admin_users creator ON t.assigned_by = creator.id
      LEFT JOIN admin_users assignee ON t.assigned_to = assignee.id
      WHERE ${whereClause}
      ORDER BY 
        CASE t.priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        t.created_at DESC
    `
    
    const tasks = await DB.prepare(tasksQuery).bind(...params).all()

    // Organize by status
    const board = {
      todo: [],
      in_progress: [],
      review: [],
      done: []
    }

    for (const task of tasks.results || []) {
      const t = task as any
      const status = t.status || 'todo'
      if (board[status as keyof typeof board]) {
        board[status as keyof typeof board].push(t)
      }
    }

    return c.json({
      success: true,
      data: board
    })
  } catch (error: any) {
    console.error('Error fetching board:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch board',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/tasks/:id
 * Get single task details
 */
app.get('/:id', async (c) => {
  const { DB } = c.env
  const taskId = c.req.param('id')

  try {
    const task = await DB.prepare(`
      SELECT 
        t.*,
        creator.full_name as assigned_by_name,
        creator.email as assigned_by_email,
        assignee.full_name as assigned_to_name,
        assignee.email as assigned_to_email,
        assignee.username as assigned_to_avatar
      FROM staff_tasks t
      LEFT JOIN admin_users creator ON t.assigned_by = creator.id
      LEFT JOIN admin_users assignee ON t.assigned_to = assignee.id
      WHERE t.id = ?
    `).bind(taskId).first()

    if (!task) {
      return c.json({
        success: false,
        error: 'Task not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: task
    })
  } catch (error: any) {
    console.error('Error fetching task:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch task',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/tasks/create
 * Create new task
 */
app.post('/create', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')

  console.log('[TASK CREATE] Starting task creation...')
  console.log('[TASK CREATE] adminUser:', adminUser)

  try {
    const body = await c.req.json()
    console.log('[TASK CREATE] Request body:', body)
    
    const {
      title,
      description,
      status = 'todo',
      priority = 'medium',
      category,
      assigned_to,
      due_date,
      estimated_hours
    } = body

    if (!title) {
      console.log('[TASK CREATE] ❌ Title is missing')
      return c.json({
        success: false,
        error: 'Title is required'
      }, 400)
    }

    if (!adminUser || !adminUser.id) {
      console.log('[TASK CREATE] ❌ adminUser not found in context')
      return c.json({
        success: false,
        error: 'User authentication required'
      }, 401)
    }

    console.log('[TASK CREATE] Inserting task into database...')
    const result = await DB.prepare(`
      INSERT INTO staff_tasks (
        task_type, reference_type, reference_id, title, description, 
        status, priority, assigned_to, assigned_by, due_date, 
        estimated_minutes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      'manual',
      'crm',
      0,
      title,
      description || null,
      status,
      priority,
      assigned_to || null,
      adminUser.id,
      due_date || null,
      estimated_hours ? estimated_hours * 60 : null
    ).run()
    
    console.log('[TASK CREATE] ✅ Task inserted, ID:', result.meta.last_row_id)

    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id, description,
          severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser.id,
        'task_created',
        'task',
        result.meta.last_row_id,
        `Created task: ${title}`,
        'info'
      ).run()
      console.log('[TASK CREATE] ✅ Activity logged')
    } catch (logError) {
      console.warn('[TASK CREATE] ⚠️ Failed to log activity:', logError)
      // Don't fail the request if logging fails
    }

    console.log('[TASK CREATE] ✅ Task creation successful!')
    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: 'Task created successfully'
      }
    })
  } catch (error: any) {
    console.error('[TASK CREATE] ❌ Error creating task:', error)
    console.error('[TASK CREATE] Error details:', error.message, error.stack)
    return c.json({
      success: false,
      error: 'Failed to create task',
      details: error.message
    }, 500)
  }
})

/**
 * PUT /api/crm/tasks/:id
 * Update task
 */
app.put('/:id', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const taskId = c.req.param('id')

  try {
    const body = await c.req.json()
    const {
      title,
      description,
      status,
      priority,
      category,
      assigned_to,
      due_date,
      estimated_hours,
      actual_hours
    } = body

    // Check if task exists
    const existingTask = await DB.prepare('SELECT * FROM staff_tasks WHERE id = ?')
      .bind(taskId).first()

    if (!existingTask) {
      return c.json({
        success: false,
        error: 'Task not found'
      }, 404)
    }

    // Build update query
    const updates: string[] = []
    const params: any[] = []

    if (title !== undefined) {
      updates.push('title = ?')
      params.push(title)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      params.push(description)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (priority !== undefined) {
      updates.push('priority = ?')
      params.push(priority)
    }
    // Note: category column doesn't exist in staff_tasks
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?')
      params.push(assigned_to || null)
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?')
      params.push(due_date || null)
    }
    if (estimated_hours !== undefined) {
      // Convert hours to minutes for estimated_minutes column
      updates.push('estimated_minutes = ?')
      params.push(estimated_hours ? estimated_hours * 60 : null)
    }
    if (actual_hours !== undefined) {
      // Convert hours to minutes for actual_minutes column
      updates.push('actual_minutes = ?')
      params.push(actual_hours ? actual_hours * 60 : null)
    }

    updates.push('updated_at = datetime("now")')
    params.push(taskId)

    await DB.prepare(`
      UPDATE staff_tasks
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run()

    // Log activity (wrap in try-catch to not block the update)
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id,
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser.id,
        'task_updated',
        'task',
        taskId,
        `Updated task: ${title || (existingTask as any).title}`,
        'info'
      ).run()
    } catch (logError) {
      console.error('[TASK UPDATE] Failed to log activity:', logError)
    }

    return c.json({
      success: true,
      message: 'Task updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating task:', error)
    return c.json({
      success: false,
      error: 'Failed to update task',
      details: error.message
    }, 500)
  }
})

/**
 * PUT /api/crm/tasks/:id/status
 * Update task status (for drag & drop)
 */
app.put('/:id/status', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const taskId = c.req.param('id')

  try {
    const body = await c.req.json()
    const { status, position } = body

    if (!status) {
      return c.json({
        success: false,
        error: 'Status is required'
      }, 400)
    }

    await DB.prepare(`
      UPDATE staff_tasks
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, taskId).run()

    // Log activity (wrap in try-catch to not block status update)
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id, 
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser.id,
        'task_status_changed',
        'task',
        taskId,
        `Changed task status to: ${status}`,
        'info'
      ).run()
    } catch (logError) {
      console.error('[TASK STATUS] Failed to log activity:', logError)
    }

    return c.json({
      success: true,
      message: 'Task status updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating task status:', error)
    return c.json({
      success: false,
      error: 'Failed to update task status',
      details: error.message
    }, 500)
  }
})

/**
 * DELETE /api/crm/tasks/:id
 * Delete task
 * Note: requireCRMAccess is already applied at parent level
 */
app.delete('/:id', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const taskId = c.req.param('id')

  console.log('[TASK DELETE] Starting deletion for task ID:', taskId)
  console.log('[TASK DELETE] Admin user:', adminUser)

  try {
    // Get task details before deletion
    const task = await DB.prepare('SELECT title FROM staff_tasks WHERE id = ?')
      .bind(taskId).first()

    console.log('[TASK DELETE] Task found:', task)

    if (!task) {
      return c.json({
        success: false,
        error: 'Task not found'
      }, 404)
    }

    // Delete comments first
    console.log('[TASK DELETE] Deleting comments...')
    await DB.prepare('DELETE FROM task_comments WHERE task_id = ?').bind(taskId).run()
    console.log('[TASK DELETE] Comments deleted')

    // Delete task
    console.log('[TASK DELETE] Deleting task...')
    await DB.prepare('DELETE FROM staff_tasks WHERE id = ?').bind(taskId).run()
    console.log('[TASK DELETE] Task deleted')

    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id,
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser?.id || null,
        'task_deleted',
        'task',
        taskId,
        `Deleted task: ${(task as any).title}`,
        'warning'
      ).run()
    } catch (logError) {
      console.error('[TASK DELETE] Failed to log activity:', logError)
    }

    console.log('[TASK DELETE] Success! Returning response')
    return c.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error: any) {
    console.error('[TASK DELETE] ERROR:', error)
    console.error('[TASK DELETE] ERROR Stack:', error.stack)
    console.error('[TASK DELETE] ERROR Message:', error.message)
    return c.json({
      success: false,
      error: 'Failed to delete task',
      details: error.message,
      stack: error.stack
    }, 500)
  }
})

/**
 * GET /api/crm/tasks/:id/comments
 * Get task comments
 */
app.get('/:id/comments', async (c) => {
  const { DB } = c.env
  const taskId = c.req.param('id')

  try {
    const comments = await DB.prepare(`
      SELECT 
        tc.*,
        au.full_name as author_name,
        au.email as author_email,
        au.avatar_url as author_avatar
      FROM task_comments tc
      LEFT JOIN admin_users au ON tc.author_id = au.id
      WHERE tc.task_id = ?
      ORDER BY tc.created_at DESC
    `).bind(taskId).all()

    return c.json({
      success: true,
      data: comments.results || []
    })
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch comments',
      details: error.message
    }, 500)
  }
})

/**
 * POST /api/crm/tasks/:id/comments
 * Add comment to task
 */
app.post('/:id/comments', async (c) => {
  const { DB } = c.env
  const adminUser = c.get('adminUser')
  const taskId = c.req.param('id')

  try {
    const body = await c.req.json()
    const { comment } = body

    if (!comment) {
      return c.json({
        success: false,
        error: 'Comment is required'
      }, 400)
    }

    const result = await DB.prepare(`
      INSERT INTO task_comments (
        task_id, author_id, comment, created_at
      ) VALUES (?, ?, ?, datetime('now'))
    `).bind(taskId, adminUser.id, comment).run()

    // Log activity
    try {
      await DB.prepare(`
        INSERT INTO activity_logs (
          staff_id, action, resource_type, resource_id,
          description, severity, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        adminUser?.id || null,
        'comment_added',
        'task',
        taskId,
        'Added comment to task',
        'info'
      ).run()
    } catch (logError) {
      console.error('[TASK COMMENT] Failed to log activity:', logError)
    }

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        message: 'Comment added successfully'
      }
    })
  } catch (error: any) {
    console.error('Error adding comment:', error)
    return c.json({
      success: false,
      error: 'Failed to add comment',
      details: error.message
    }, 500)
  }
})

/**
 * GET /api/crm/tasks/stats
 * Get task statistics
 */
app.get('/stats', async (c) => {
  const { DB } = c.env

  try {
    // Total tasks by status
    const byStatus = await DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM staff_tasks
      GROUP BY status
    `).all()

    // Total tasks by priority
    const byPriority = await DB.prepare(`
      SELECT priority, COUNT(*) as count
      FROM staff_tasks
      GROUP BY priority
    `).all()

    // Overdue tasks
    const overdue = await DB.prepare(`
      SELECT COUNT(*) as count
      FROM staff_tasks
      WHERE due_date < date('now') AND status != 'done'
    `).first()

    // Tasks by assignee
    const byAssignee = await DB.prepare(`
      SELECT 
        au.full_name as name,
        COUNT(*) as count
      FROM staff_tasks t
      LEFT JOIN admin_users au ON t.assigned_to = au.id
      WHERE t.assigned_to IS NOT NULL
      GROUP BY t.assigned_to
      ORDER BY count DESC
      LIMIT 10
    `).all()

    return c.json({
      success: true,
      data: {
        byStatus: byStatus.results || [],
        byPriority: byPriority.results || [],
        overdue: (overdue as any)?.count || 0,
        byAssignee: byAssignee.results || []
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

export default app
