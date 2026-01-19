/**
 * DeepMine AI - Internal Notes Routes
 * Staff collaboration and communication
 */

import { Hono } from 'hono'
import type { InternalNote } from '../types/crm'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

/**
 * GET /api/crm/notes
 * List notes for a specific resource or all notes
 */
app.get('/', async (c) => {
  try {
    const { DB } = c.env
    
    const reference_type = c.req.query('reference_type')
    const reference_id = c.req.query('reference_id')
    const note_type = c.req.query('note_type')
    const is_important = c.req.query('is_important')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')

    let query = `
      SELECT 
        n.*,
        au.full_name as author_name,
        au.avatar_url as author_avatar
      FROM internal_notes n
      LEFT JOIN admin_users au ON n.created_by = au.id
      WHERE 1=1
    `
    const params: any[] = []

    if (reference_type) {
      query += ` AND n.reference_type = ?`
      params.push(reference_type)
    }

    if (reference_id) {
      query += ` AND n.reference_id = ?`
      params.push(parseInt(reference_id))
    }

    if (note_type) {
      query += ` AND n.note_type = ?`
      params.push(note_type)
    }

    if (is_important !== undefined) {
      query += ` AND n.is_important = ?`
      params.push(is_important === 'true' ? 1 : 0)
    }

    query += ` ORDER BY n.created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const result = await DB.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      data: result.results || [],
      meta: {
        limit,
        offset,
        total: result.results?.length || 0
      }
    })
  } catch (error) {
    console.error('Notes List Error:', error)
    return c.json({ success: false, message: 'Failed to fetch notes' }, 500)
  }
})

/**
 * POST /api/crm/notes
 * Create a new internal note
 */
app.post('/', async (c) => {
  try {
    const { DB } = c.env
    const body = await c.req.json()

    const {
      reference_type,
      reference_id,
      note,
      note_type = 'comment',
      is_private = false,
      is_important = false,
      mentioned_users = [],
      attachments = []
    } = body

    // Validation
    if (!reference_type || !reference_id || !note) {
      return c.json({
        success: false,
        message: 'reference_type, reference_id, and note are required'
      }, 400)
    }

    // TODO: Get current admin's ID from auth
    const created_by = 1 // Placeholder

    const result = await DB.prepare(`
      INSERT INTO internal_notes (
        reference_type, reference_id, note, note_type,
        created_by, is_private, is_important, mentioned_users,
        attachments, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      reference_type,
      reference_id,
      note,
      note_type,
      created_by,
      is_private ? 1 : 0,
      is_important ? 1 : 0,
      mentioned_users.length > 0 ? JSON.stringify(mentioned_users) : null,
      attachments.length > 0 ? JSON.stringify(attachments) : null
    ).run()

    const noteId = result.meta.last_row_id

    // Log activity
    await DB.prepare(`
      INSERT INTO activity_logs (
        staff_id, action, action_category, resource_type, resource_id,
        description, severity, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      created_by,
      'created',
      'note',
      reference_type,
      reference_id,
      `Added ${note_type} note to ${reference_type} #${reference_id}`,
      'info'
    ).run()

    // TODO: Send notifications to mentioned users

    // Fetch the created note with author info
    const newNote = await DB.prepare(`
      SELECT 
        n.*,
        au.full_name as author_name,
        au.avatar_url as author_avatar
      FROM internal_notes n
      LEFT JOIN admin_users au ON n.created_by = au.id
      WHERE n.id = ?
    `).bind(noteId).first()

    return c.json({
      success: true,
      message: 'Note created successfully',
      data: newNote
    }, 201)
  } catch (error) {
    console.error('Create Note Error:', error)
    return c.json({ success: false, message: 'Failed to create note' }, 500)
  }
})

/**
 * PUT /api/crm/notes/:id
 * Update an existing note
 */
app.put('/:id', async (c) => {
  try {
    const { DB } = c.env
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return c.json({ success: false, message: 'Invalid note ID' }, 400)
    }

    const {
      note,
      note_type,
      is_important,
      is_private
    } = body

    // Check if note exists
    const existing = await DB.prepare('SELECT id FROM internal_notes WHERE id = ?').bind(id).first()
    if (!existing) {
      return c.json({ success: false, message: 'Note not found' }, 404)
    }

    // Build update query
    const updates: string[] = []
    const params: any[] = []

    if (note !== undefined) {
      updates.push('note = ?')
      params.push(note)
    }
    if (note_type !== undefined) {
      updates.push('note_type = ?')
      params.push(note_type)
    }
    if (is_important !== undefined) {
      updates.push('is_important = ?')
      params.push(is_important ? 1 : 0)
    }
    if (is_private !== undefined) {
      updates.push('is_private = ?')
      params.push(is_private ? 1 : 0)
    }

    if (updates.length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }

    updates.push('updated_at = datetime("now")')
    params.push(id)

    await DB.prepare(`UPDATE internal_notes SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run()

    // Fetch updated note
    const updated = await DB.prepare(`
      SELECT 
        n.*,
        au.full_name as author_name,
        au.avatar_url as author_avatar
      FROM internal_notes n
      LEFT JOIN admin_users au ON n.created_by = au.id
      WHERE n.id = ?
    `).bind(id).first()

    return c.json({
      success: true,
      message: 'Note updated successfully',
      data: updated
    })
  } catch (error) {
    console.error('Update Note Error:', error)
    return c.json({ success: false, message: 'Failed to update note' }, 500)
  }
})

/**
 * DELETE /api/crm/notes/:id
 * Delete a note
 */
app.delete('/:id', async (c) => {
  try {
    const { DB } = c.env
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ success: false, message: 'Invalid note ID' }, 400)
    }

    const existing = await DB.prepare('SELECT id FROM internal_notes WHERE id = ?').bind(id).first()
    if (!existing) {
      return c.json({ success: false, message: 'Note not found' }, 404)
    }

    await DB.prepare('DELETE FROM internal_notes WHERE id = ?').bind(id).run()

    return c.json({
      success: true,
      message: 'Note deleted successfully'
    })
  } catch (error) {
    console.error('Delete Note Error:', error)
    return c.json({ success: false, message: 'Failed to delete note' }, 500)
  }
})

/**
 * GET /api/crm/notes/resource/:type/:id
 * Get all notes for a specific resource (shorthand)
 */
app.get('/resource/:type/:id', async (c) => {
  try {
    const { DB } = c.env
    const reference_type = c.req.param('type')
    const reference_id = parseInt(c.req.param('id'))

    if (isNaN(reference_id)) {
      return c.json({ success: false, message: 'Invalid resource ID' }, 400)
    }

    const notes = await DB.prepare(`
      SELECT 
        n.*,
        au.full_name as author_name,
        au.avatar_url as author_avatar
      FROM internal_notes n
      LEFT JOIN admin_users au ON n.created_by = au.id
      WHERE n.reference_type = ? AND n.reference_id = ?
      ORDER BY n.created_at DESC
    `).bind(reference_type, reference_id).all()

    return c.json({
      success: true,
      data: notes.results || [],
      meta: {
        reference_type,
        reference_id,
        total: notes.results?.length || 0
      }
    })
  } catch (error) {
    console.error('Resource Notes Error:', error)
    return c.json({ success: false, message: 'Failed to fetch notes' }, 500)
  }
})

export default app
