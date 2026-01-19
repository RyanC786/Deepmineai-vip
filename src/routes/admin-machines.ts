import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const adminMachines = new Hono<{ Bindings: Bindings }>();

// Note: Admin authentication is already applied at app level via app.use('/api/admin/*', requireAdmin)

// List all pending machines for activation
adminMachines.get('/list', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        um.id as machine_id,
        um.user_id,
        um.package_id,
        um.purchase_price,
        um.activation_status,
        um.activated_at,
        um.expires_at,
        um.created_at,
        u.email,
        u.full_name,
        mp.name as package_name,
        mp.daily_earnings,
        mp.duration_days
      FROM user_miners um
      JOIN users u ON um.user_id = u.id
      JOIN mining_packages mp ON um.package_id = mp.id
      ORDER BY 
        CASE um.activation_status 
          WHEN 'pending' THEN 1 
          WHEN 'active' THEN 2 
          WHEN 'rejected' THEN 3 
          WHEN 'expired' THEN 4 
        END,
        um.created_at DESC
    `).all();

    return c.json({
      success: true,
      machines: results
    });
  } catch (error: any) {
    console.error('List machines error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch machines'
    }, 500);
  }
});

// Activate a machine
adminMachines.post('/:id/activate', async (c) => {
  try {
    const machineId = parseInt(c.req.param('id'));
    const adminEmail = c.get('userEmail');

    // Get machine details
    const machine = await c.env.DB.prepare(`
      SELECT um.*, mp.duration_days, mp.daily_earnings, u.email as user_email
      FROM user_miners um
      JOIN mining_packages mp ON um.package_id = mp.id
      JOIN users u ON um.user_id = u.id
      WHERE um.id = ?
    `).bind(machineId).first();

    if (!machine) {
      return c.json({
        success: false,
        message: 'Machine not found'
      }, 404);
    }

    if (machine.activation_status !== 'pending') {
      return c.json({
        success: false,
        message: `Machine is already ${machine.activation_status}`
      }, 400);
    }

    // Calculate expiration date (180 days from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (machine.duration_days * 24 * 60 * 60 * 1000));

    // Activate the machine
    await c.env.DB.prepare(`
      UPDATE user_miners 
      SET 
        status = 'active',
        activation_status = 'active',
        activated_at = datetime('now'),
        expires_at = ?
      WHERE id = ?
    `).bind(expiresAt.toISOString(), machineId).run();

    // Log admin action (optional - skip if table schema doesn't match)
    try {
      const adminId = c.get('userId'); // Get admin user ID from auth context
      if (adminId) {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          adminId,
          'activate_machine',
          'user_miner',
          machineId,
          `Activated machine for ${machine.user_email} - Package: ${machine.package_id}, Daily: $${machine.daily_earnings}`
        ).run();
      }
    } catch (logError) {
      console.warn('⚠️ Failed to log admin action:', logError);
      // Continue anyway - logging is optional
    }

    return c.json({
      success: true,
      message: 'Machine activated successfully',
      activated_at: now.toISOString(),
      expires_at: expiresAt.toISOString()
    });
  } catch (error: any) {
    console.error('Activate machine error:', error);
    return c.json({
      success: false,
      message: 'Failed to activate machine'
    }, 500);
  }
});

// Reject a machine
adminMachines.post('/:id/reject', async (c) => {
  try {
    const machineId = parseInt(c.req.param('id'));
    const adminEmail = c.get('userEmail');
    const { reason } = await c.req.json();

    // Get machine details
    const machine = await c.env.DB.prepare(`
      SELECT um.*, u.email as user_email, u.wallet_balance, mp.name as package_name
      FROM user_miners um
      JOIN users u ON um.user_id = u.id
      JOIN mining_packages mp ON um.package_id = mp.id
      WHERE um.id = ?
    `).bind(machineId).first();

    if (!machine) {
      return c.json({
        success: false,
        message: 'Machine not found'
      }, 404);
    }

    if (machine.activation_status !== 'pending') {
      return c.json({
        success: false,
        message: `Machine is already ${machine.activation_status}`
      }, 400);
    }

    // Reject the machine
    await c.env.DB.prepare(`
      UPDATE user_miners 
      SET activation_status = 'rejected'
      WHERE id = ?
    `).bind(machineId).run();

    // Refund the purchase price to user's wallet
    await c.env.DB.prepare(`
      UPDATE users 
      SET 
        wallet_balance = wallet_balance + ?,
        total_invested = total_invested - ?
      WHERE id = ?
    `).bind(machine.purchase_price, machine.purchase_price, machine.user_id).run();

    // Log refund transaction
    await c.env.DB.prepare(`
      INSERT INTO transactions (
        user_id, transaction_type, amount, status, description
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(
      machine.user_id,
      'refund',
      machine.purchase_price,
      'completed',
      `Refund for rejected machine: ${machine.package_name}`
    ).run();

    // Log admin action (optional - skip if table schema doesn't match)
    try {
      const adminId = c.get('userId'); // Get admin user ID from auth context
      if (adminId) {
        await c.env.DB.prepare(`
          INSERT INTO admin_logs (admin_id, action_type, target_type, target_id, description)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          adminId,
          'reject_machine',
          'user_miner',
          machineId,
          `Rejected machine for ${machine.user_email} - Refund: $${machine.purchase_price}, Reason: ${reason || 'Not specified'}`
        ).run();
      }
    } catch (logError) {
      console.warn('⚠️ Failed to log admin action:', logError);
      // Continue anyway - logging is optional
    }

    return c.json({
      success: true,
      message: 'Machine rejected and refunded successfully',
      refund_amount: machine.purchase_price
    });
  } catch (error: any) {
    console.error('Reject machine error:', error);
    return c.json({
      success: false,
      message: 'Failed to reject machine'
    }, 500);
  }
});

// Get machine statistics
adminMachines.get('/stats', async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_machines,
        SUM(CASE WHEN activation_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN activation_status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN activation_status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN activation_status = 'expired' THEN 1 ELSE 0 END) as expired,
        SUM(purchase_price) as total_invested
      FROM user_miners
    `).first();

    return c.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch statistics'
    }, 500);
  }
});

export default adminMachines;
