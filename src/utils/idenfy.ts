// iDenfy KYC Integration for DeepMine AI
// Documentation: https://documentation.idenfy.com/

/**
 * Create iDenfy verification token
 */
export async function createIdenfyVerification(
  apiKey: string,
  apiSecret: string,
  userData: {
    clientId: string
    firstName: string
    lastName: string
    email?: string
    phone?: string
  }
): Promise<{ success: boolean; token?: string; scanRef?: string; error?: string }> {
  try {
    console.log('🔑 Creating iDenfy verification for:', { clientId: userData.clientId, firstName: userData.firstName, lastName: userData.lastName })
    console.log('🔑 API Key length:', apiKey?.length, 'Secret length:', apiSecret?.length)
    
    const authToken = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    const requestBody = {
      clientId: userData.clientId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      successUrl: 'https://www.deepmineai.vip/kyc?status=success',
      errorUrl: 'https://www.deepmineai.vip/kyc?status=error',
      unverifiedUrl: 'https://www.deepmineai.vip/kyc?status=unverified',
      locale: 'en',
      showInstructions: true,
      expiryTime: 86400, // 24 hours
      sessionLength: 600, // 10 minutes
      documents: ['ID_CARD', 'PASSPORT', 'DRIVER_LICENSE', 'RESIDENCE_PERMIT']
    }
    
    console.log('📤 iDenfy request body:', JSON.stringify(requestBody))
    
    const response = await fetch('https://ivs.idenfy.com/api/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('📥 iDenfy response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ iDenfy create verification error:', response.status, errorText)
      
      // Try to parse error message
      let errorMessage = `iDenfy API error: ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch (e) {
        // If not JSON, use the raw text
        if (errorText) {
          errorMessage = errorText.substring(0, 200)
        }
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
    
    const data = await response.json()
    console.log('✅ iDenfy token created successfully:', { authToken: data.authToken?.substring(0, 10) + '...', scanRef: data.scanRef })
    
    return {
      success: true,
      token: data.authToken,
      scanRef: data.scanRef
    }
  } catch (error) {
    console.error('iDenfy verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get verification status from iDenfy
 */
export async function getIdenfyStatus(
  apiKey: string,
  apiSecret: string,
  scanRef: string
): Promise<{ success: boolean; status?: string; data?: any; error?: string }> {
  try {
    const authToken = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    const response = await fetch(`https://ivs.idenfy.com/api/v2/status?scanRef=${scanRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authToken}`
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('iDenfy status check error:', response.status, errorText)
      
      // Try to parse the error response
      let errorMessage = `iDenfy API error: ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          errorMessage += ` - ${errorData.message}`
        } else if (errorData.error) {
          errorMessage += ` - ${errorData.error}`
        }
      } catch (e) {
        // Not JSON, include raw text
        if (errorText && errorText.length < 200) {
          errorMessage += ` - ${errorText}`
        }
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
    
    const data = await response.json()
    
    return {
      success: true,
      status: data.status,
      data: data
    }
  } catch (error) {
    console.error('iDenfy status check error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Verify iDenfy webhook signature
 */
export async function verifyIdenfyWebhook(
  signingKey: string,
  payload: string,
  signature: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(signingKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    )
    
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return expectedHex === signature
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Map iDenfy status to internal status
 */
export function mapIdenfyStatus(idenfyStatus: string): 'pending' | 'approved' | 'rejected' | 'reviewing' {
  const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'reviewing'> = {
    'APPROVED': 'approved',
    'DENIED': 'rejected',
    'SUSPECTED': 'reviewing',
    'REVIEWING': 'reviewing',
    'ACTIVE': 'pending',
    'EXPIRED': 'rejected',
    'DELETED': 'rejected'
  }
  
  return statusMap[idenfyStatus] || 'pending'
}

/**
 * iDenfy webhook event types
 */
export interface IdenfyWebhookEvent {
  platform: string
  status: string
  scanRef: string
  clientId: string
  startTime: number
  finishTime?: number
  clientIp?: string
  clientIpCountry?: string
  clientLocation?: string
  fraudTags?: string[]
  mismatchTags?: string[]
  autoDocument?: string
  autoFace?: string
  manualDocument?: string
  manualFace?: string
  overall?: string
}
