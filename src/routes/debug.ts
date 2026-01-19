import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/*', cors())

// Force refresh user data from database (bypass cache)
app.get('/force-refresh/:email', async (c) => {
  const { DB } = c.env
  const email = c.req.param('email')

  try {
    // Get fresh data directly from database
    const user = await DB.prepare(`
      SELECT 
        id, email, full_name, phone, country,
        kyc_status, kyc_submitted_at, kyc_approved_at,
        account_status, wallet_balance, total_invested,
        total_earned, total_withdrawn,
        referral_code, referred_by_code
      FROM users 
      WHERE email = ?
    `).bind(email).first()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      message: 'Fresh data from database',
      user: user,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default app
