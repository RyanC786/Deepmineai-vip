import { Hono } from 'hono'

const app = new Hono()

app.post('/simple-create', async (c) => {
  try {
    console.log('[SIMPLE CREATE] Starting...')
    
    // Check env
    console.log('[SIMPLE CREATE] c.env exists:', !!c.env)
    console.log('[SIMPLE CREATE] c.env.DB exists:', !!(c.env as any)?.DB)
    
    const body = await c.req.json()
    console.log('[SIMPLE CREATE] Body:', JSON.stringify(body))
    
    const DB = (c.env as any).DB
    
    if (!DB) {
      console.error('[SIMPLE CREATE] No DB binding!')
      return c.json({
        success: false,
        error: 'Database binding not found',
        env_keys: Object.keys(c.env || {})
      }, 500)
    }
    
    console.log('[SIMPLE CREATE] About to execute query...')
    
    const result = await DB.prepare(`
      INSERT INTO leads (
        first_name, email, source, status, stage, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      body.first_name,
      body.email,
      body.source || 'website',
      'new',
      'new',
      1
    ).run()
    
    console.log('[SIMPLE CREATE] Success! ID:', result.meta.last_row_id)
    
    return c.json({
      success: true,
      id: result.meta.last_row_id,
      message: 'Lead created successfully'
    })
  } catch (error: any) {
    console.error('[SIMPLE CREATE] Error:', error)
    console.error('[SIMPLE CREATE] Error stack:', error.stack)
    console.error('[SIMPLE CREATE] Error message:', error.message)
    return c.json({
      success: false,
      error: error.message || String(error),
      stack: error.stack || 'No stack trace',
      name: error.name || 'Unknown error'
    }, 500)
  }
})

export default app
