/**
 * Google Drive Service
 * Handles file uploads and folder management for KYC document backup
 * Uses Google Drive REST API v3 (no googleapis package needed for Cloudflare Workers)
 */

/**
 * Get Google OAuth2 access token from service account
 */
async function getAccessToken(serviceAccountKey: string): Promise<string> {
  const credentials = JSON.parse(serviceAccountKey)
  
  // Create JWT
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/drive.file',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }
  
  const encoder = new TextEncoder()
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const signatureInput = `${headerB64}.${claimB64}`
  
  // Import private key
  const privateKey = credentials.private_key.replace(/\\n/g, '\n')
  const keyData = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  // Sign
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    keyData,
    encoder.encode(signatureInput)
  )
  
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  const jwt = `${signatureInput}.${signatureB64}`
  
  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  })
  
  const data = await response.json() as any
  return data.access_token
}

/**
 * Convert PEM to ArrayBuffer
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Convert ArrayBuffer to base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Create a folder in Google Drive
 */
export async function createDriveFolder(
  serviceAccountKey: string,
  folderName: string,
  parentFolderId?: string
): Promise<{ success: boolean; folderId?: string; error?: string }> {
  try {
    const accessToken = await getAccessToken(serviceAccountKey)
    
    // Check if folder already exists
    const query = parentFolderId
      ? `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
      : `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
    
    const listResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    )
    
    const listData = await listResponse.json() as any
    
    if (listData.files && listData.files.length > 0) {
      return {
        success: true,
        folderId: listData.files[0].id
      }
    }
    
    // Create new folder
    const fileMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    }
    
    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId]
    }
    
    const createResponse = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileMetadata)
    })
    
    const folder = await createResponse.json() as any
    
    return {
      success: true,
      folderId: folder.id
    }
  } catch (error) {
    console.error('Failed to create Drive folder:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Upload file to Google Drive
 */
export async function uploadToDrive(
  serviceAccountKey: string,
  fileName: string,
  fileBuffer: ArrayBuffer,
  mimeType: string,
  folderId: string
): Promise<{ success: boolean; fileId?: string; webViewLink?: string; error?: string }> {
  try {
    const accessToken = await getAccessToken(serviceAccountKey)
    
    // Upload using multipart upload
    const boundary = '-------314159265358979323846'
    const delimiter = `\r\n--${boundary}\r\n`
    const closeDelim = `\r\n--${boundary}--`
    
    const metadata = {
      name: fileName,
      parents: [folderId]
    }
    
    const multipartBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n` +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      arrayBufferToBase64(fileBuffer) +
      closeDelim
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    })
    
    const file = await response.json() as any
    
    return {
      success: true,
      fileId: file.id,
      webViewLink: file.webViewLink
    }
  } catch (error) {
    console.error('Failed to upload to Drive:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Upload KYC documents to Google Drive
 * Creates user folder and uploads all documents
 */
export async function backupKYCToGoogleDrive(
  serviceAccountKey: string,
  kycFolderId: string,
  userId: number,
  userEmail: string,
  documents: {
    idFront?: { buffer: ArrayBuffer; mimeType: string }
    idBack?: { buffer: ArrayBuffer; mimeType: string }
    selfie?: { buffer: ArrayBuffer; mimeType: string }
  }
): Promise<{ success: boolean; folderLink?: string; fileLinks?: any; error?: string }> {
  try {
    // Create user folder: "User_123_user@example.com"
    const userFolderName = `User_${userId}_${userEmail}`
    
    const folderResult = await createDriveFolder(
      serviceAccountKey,
      userFolderName,
      kycFolderId
    )
    
    if (!folderResult.success || !folderResult.folderId) {
      return {
        success: false,
        error: folderResult.error || 'Failed to create user folder'
      }
    }
    
    const userFolderId = folderResult.folderId
    const fileLinks: any = {}
    
    // Upload ID front
    if (documents.idFront) {
      const result = await uploadToDrive(
        serviceAccountKey,
        'ID_Front.jpg',
        documents.idFront.buffer,
        documents.idFront.mimeType,
        userFolderId
      )
      
      if (result.success) {
        fileLinks.idFront = result.webViewLink
      }
    }
    
    // Upload ID back
    if (documents.idBack) {
      const result = await uploadToDrive(
        serviceAccountKey,
        'ID_Back.jpg',
        documents.idBack.buffer,
        documents.idBack.mimeType,
        userFolderId
      )
      
      if (result.success) {
        fileLinks.idBack = result.webViewLink
      }
    }
    
    // Upload selfie
    if (documents.selfie) {
      const result = await uploadToDrive(
        serviceAccountKey,
        'Selfie.jpg',
        documents.selfie.buffer,
        documents.selfie.mimeType,
        userFolderId
      )
      
      if (result.success) {
        fileLinks.selfie = result.webViewLink
      }
    }
    
    const folderLink = `https://drive.google.com/drive/folders/${userFolderId}`
    
    return {
      success: true,
      folderLink,
      fileLinks
    }
  } catch (error) {
    console.error('Failed to backup KYC to Google Drive:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send email notification about KYC upload
 */
export async function sendKYCBackupNotification(
  userEmail: string,
  userId: number,
  folderLink: string,
  resendApiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'KYC System <kyc@deepmineai.vip>',
        to: 'kyc@deepmineai.vip',
        subject: `New KYC Documents Uploaded - User ${userId}`,
        html: `
          <h2>New KYC Documents Uploaded</h2>
          <p><strong>User ID:</strong> ${userId}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Google Drive Folder:</strong> <a href="${folderLink}">${folderLink}</a></p>
          <p>All KYC documents have been automatically backed up to Google Drive.</p>
          <p><small>This is an automated notification from DeepMine AI Platform.</small></p>
        `
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Resend API error:', errorData)
      return {
        success: false,
        error: `Email API error: ${response.status}`
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send KYC backup notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
