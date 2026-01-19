// Sumsub KYC Integration for DeepMine AI
// Documentation: https://developers.sumsub.com/

/**
 * Create Sumsub applicant
 */
export async function createSumsubApplicant(
  appToken: string,
  secretKey: string,
  userData: {
    externalUserId: string
    email: string
    phone?: string
    firstName?: string
    lastName?: string
  }
): Promise<{ success: boolean; applicantId?: string; error?: string }> {
  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const method = 'POST'
    const url = '/resources/applicants?levelName=basic-kyc-level'
    
    // Generate signature
    const signature = await generateSumsubSignature(secretKey, method, url, timestamp)
    
    const response = await fetch(`https://api.sumsub.com${url}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-App-Access-Sig': signature,
        'X-App-Access-Ts': timestamp.toString()
      },
      body: JSON.stringify({
        externalUserId: userData.externalUserId,
        email: userData.email,
        phone: userData.phone,
        fixedInfo: {
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Sumsub create applicant error:', error)
      return {
        success: false,
        error: `Sumsub API error: ${response.status}`
      }
    }
    
    const data = await response.json()
    
    return {
      success: true,
      applicantId: data.id
    }
  } catch (error) {
    console.error('Sumsub error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Generate access token for Sumsub SDK
 */
export async function generateSumsubAccessToken(
  appToken: string,
  secretKey: string,
  externalUserId: string,
  levelName: string = 'basic-kyc-level'
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const method = 'POST'
    const url = `/resources/accessTokens?userId=${externalUserId}&levelName=${levelName}`
    
    const signature = await generateSumsubSignature(secretKey, method, url, timestamp)
    
    const response = await fetch(`https://api.sumsub.com${url}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-App-Access-Sig': signature,
        'X-App-Access-Ts': timestamp.toString()
      }
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Sumsub token error:', error)
      return {
        success: false,
        error: `Failed to generate token: ${response.status}`
      }
    }
    
    const data = await response.json()
    
    return {
      success: true,
      token: data.token
    }
  } catch (error) {
    console.error('Sumsub token error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get applicant status from Sumsub
 */
export async function getSumsubApplicantStatus(
  appToken: string,
  secretKey: string,
  applicantId: string
): Promise<{
  success: boolean
  status?: 'pending' | 'queued' | 'completed' | 'onHold'
  reviewStatus?: 'init' | 'pending' | 'prechecked' | 'queued' | 'completed' | 'onHold'
  reviewResult?: 'GREEN' | 'RED' | 'RETRY'
  error?: string
}> {
  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const method = 'GET'
    const url = `/resources/applicants/${applicantId}/status`
    
    const signature = await generateSumsubSignature(secretKey, method, url, timestamp)
    
    const response = await fetch(`https://api.sumsub.com${url}`, {
      method: method,
      headers: {
        'X-App-Token': appToken,
        'X-App-Access-Sig': signature,
        'X-App-Access-Ts': timestamp.toString()
      }
    })
    
    if (!response.ok) {
      return {
        success: false,
        error: `API error: ${response.status}`
      }
    }
    
    const data = await response.json()
    
    return {
      success: true,
      status: data.reviewStatus?.reviewAnswer || 'pending',
      reviewStatus: data.reviewStatus?.reviewResult?.reviewAnswer,
      reviewResult: data.reviewStatus?.reviewResult?.reviewAnswer
    }
  } catch (error) {
    console.error('Sumsub status error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Generate Sumsub signature for API authentication
 */
async function generateSumsubSignature(
  secretKey: string,
  method: string,
  url: string,
  timestamp: number,
  body?: string
): Promise<string> {
  // Sumsub signature format: HMAC-SHA256(timestamp + method + url + body)
  const message = timestamp.toString() + method + url + (body || '')
  
  // Convert secret key to bytes
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secretKey)
  const messageData = encoder.encode(message)
  
  // Import key for HMAC
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  // Generate signature
  const signature = await crypto.subtle.sign('HMAC', key, messageData)
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(signature))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * Webhook verification for Sumsub callbacks
 */
export async function verifySumsubWebhook(
  secretKey: string,
  body: string,
  signature: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secretKey)
    const messageData = encoder.encode(body)
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const computedSignature = await crypto.subtle.sign('HMAC', key, messageData)
    const computedHex = Array.from(new Uint8Array(computedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return computedHex === signature
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Map Sumsub status to our internal status
 */
export function mapSumsubStatus(sumsubStatus: string): 'pending' | 'approved' | 'rejected' | 'reviewing' {
  const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'reviewing'> = {
    'init': 'pending',
    'pending': 'reviewing',
    'queued': 'reviewing',
    'prechecked': 'reviewing',
    'completed': 'approved',
    'onHold': 'reviewing',
    'GREEN': 'approved',
    'RED': 'rejected',
    'RETRY': 'pending'
  }
  
  return statusMap[sumsubStatus] || 'pending'
}
