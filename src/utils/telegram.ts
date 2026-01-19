/**
 * Telegram Bot Notification System
 * Sends admin notifications to Telegram group
 */

export interface TelegramNotificationResult {
  success: boolean
  error?: string
  messageId?: number
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(
  message: string,
  botToken: string,
  chatId: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<TelegramNotificationResult> {
  try {
    if (!botToken || !chatId) {
      return { 
        success: false, 
        error: 'Missing Telegram credentials (TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID)' 
      }
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: parseMode,
          disable_web_page_preview: false
        })
      }
    )

    const data = await response.json()

    if (response.ok && data.ok) {
      return { 
        success: true, 
        messageId: data.result?.message_id 
      }
    } else {
      return { 
        success: false, 
        error: data.description || 'Failed to send Telegram message' 
      }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Send new user registration notification
 */
export async function notifyNewUserRegistration(
  userName: string,
  userEmail: string,
  userId: number,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const message = `
🆕 <b>New User Registered</b>

👤 <b>Name:</b> ${userName}
📧 <b>Email:</b> ${userEmail}
🆔 <b>User ID:</b> #${userId}
🕐 <b>Time:</b> ${new Date().toUTCString()}

⏳ User may submit KYC documents soon.

<a href="https://www.deepmineai.vip/admin/users">View Users</a>
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send KYC submission completed notification (awaiting admin approval)
 */
export async function notifyKYCSubmissionComplete(
  userName: string,
  userEmail: string,
  userId: number,
  submissionId: number,
  documentType: string,
  idenfyStatus: string,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const statusEmoji = idenfyStatus === 'APPROVED' ? '✅' : '⏳'
  
  const message = `
${statusEmoji} <b>KYC Verification Complete - Awaiting Approval</b>

👤 <b>User:</b> ${userName}
📧 <b>Email:</b> ${userEmail}
🆔 <b>Document:</b> ${documentType || 'Unknown'}
${statusEmoji} <b>iDenfy Status:</b> ${idenfyStatus}
📋 <b>Submission ID:</b> #${submissionId}
🕐 <b>Time:</b> ${new Date().toUTCString()}

⚠️ <b>ACTION REQUIRED:</b> Review and approve this submission.

👉 <a href="https://www.deepmineai.vip/admin/kyc">Review in Admin Panel</a>
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send user approved notification
 */
export async function notifyKYCApproved(
  userName: string,
  userEmail: string,
  approvedBy: string,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const message = `
✅ <b>KYC Approved</b>

👤 <b>User:</b> ${userName}
📧 <b>Email:</b> ${userEmail}
👨‍💼 <b>Approved By:</b> ${approvedBy}
🕐 <b>Time:</b> ${new Date().toUTCString()}

User now has full dashboard access.
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send user rejected notification
 */
export async function notifyKYCRejected(
  userName: string,
  userEmail: string,
  reason: string,
  rejectedBy: string,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const message = `
❌ <b>KYC Rejected</b>

👤 <b>User:</b> ${userName}
📧 <b>Email:</b> ${userEmail}
📝 <b>Reason:</b> ${reason}
👨‍💼 <b>Rejected By:</b> ${rejectedBy}
🕐 <b>Time:</b> ${new Date().toUTCString()}

User will need to resubmit documents.
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send daily summary notification
 */
export async function notifyDailySummary(
  pendingCount: number,
  approvedToday: number,
  rejectedToday: number,
  newUsersToday: number,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const message = `
📊 <b>Daily KYC Summary</b>

⏳ <b>Pending Approvals:</b> ${pendingCount}
✅ <b>Approved Today:</b> ${approvedToday}
❌ <b>Rejected Today:</b> ${rejectedToday}
🆕 <b>New Users Today:</b> ${newUsersToday}

🕐 <b>Report Time:</b> ${new Date().toUTCString()}

${pendingCount > 0 ? `⚠️ <b>${pendingCount} submissions need your review!</b>\n\n👉 <a href="https://www.deepmineai.vip/admin/kyc">Review Now</a>` : '✅ All submissions reviewed!'}
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send test notification
 */
export async function sendTestNotification(
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const message = `
🤖 <b>DeepMine AI Admin Bot Activated!</b>

✅ Bot successfully connected to your admin group.

<b>Notifications enabled for:</b>
• New user registrations
• KYC submissions completed
• Users awaiting approval
• KYC approvals/rejections

<b>Platform:</b> DeepMine AI
<b>Environment:</b> Production
<b>Time:</b> ${new Date().toUTCString()}

Your admin team will now receive instant notifications when users need approval! 🚀

👉 <a href="https://www.deepmineai.vip/admin/kyc">Admin Panel</a>
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send urgent notification for multiple pending submissions
 */
export async function notifyUrgentPending(
  pendingUsers: Array<{ name: string; email: string; waitingMinutes: number }>,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const userList = pendingUsers
    .slice(0, 5) // Show max 5 users
    .map((u, i) => `${i + 1}. ${u.name} (${u.waitingMinutes}m ago)`)
    .join('\n')

  const moreCount = pendingUsers.length > 5 ? ` (+${pendingUsers.length - 5} more)` : ''

  const message = `
⚠️ <b>${pendingUsers.length} Users Awaiting KYC Approval</b>

🔔 Users waiting for review:
${userList}${moreCount}

⏰ Some users have been waiting for a while. Please review when possible.

👉 <a href="https://www.deepmineai.vip/admin/kyc">Review Now</a>
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send withdrawal request notification
 */
export async function notifyWithdrawalRequest(
  userName: string,
  userEmail: string,
  amount: number,
  currency: string,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const message = `
💰 <b>New Withdrawal Request</b>

👤 <b>User:</b> ${userName}
📧 <b>Email:</b> ${userEmail}
💵 <b>Amount:</b> ${amount} ${currency}
🕐 <b>Time:</b> ${new Date().toUTCString()}

⚠️ <b>ACTION REQUIRED:</b> Review and process withdrawal

👉 <a href="https://www.deepmineai.vip/admin/withdrawals">Review Withdrawals</a>
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}

/**
 * Send system alert notification
 */
export async function notifySystemAlert(
  alertType: 'error' | 'warning' | 'info',
  title: string,
  description: string,
  botToken: string,
  chatId: string
): Promise<TelegramNotificationResult> {
  const emoji = alertType === 'error' ? '🚨' : alertType === 'warning' ? '⚠️' : 'ℹ️'
  
  const message = `
${emoji} <b>System Alert: ${title}</b>

📝 <b>Details:</b> ${description}
🕐 <b>Time:</b> ${new Date().toUTCString()}

Please check the admin panel for more information.

👉 <a href="https://www.deepmineai.vip/admin">Admin Dashboard</a>
  `.trim()

  return sendTelegramMessage(message, botToken, chatId, 'HTML')
}
