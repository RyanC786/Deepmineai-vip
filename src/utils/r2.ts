// Cloudflare R2 utilities for file storage
// R2 is S3-compatible object storage from Cloudflare

/**
 * Upload file to R2 bucket
 */
export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  file: ArrayBuffer | ReadableStream,
  contentType: string
): Promise<{ success: boolean; key: string; url?: string; error?: string }> {
  try {
    await bucket.put(key, file, {
      httpMetadata: {
        contentType: contentType
      }
    })
    
    return {
      success: true,
      key: key,
      url: `/api/kyc/file/${key}` // Internal URL, will generate signed URL on demand
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    return {
      success: false,
      key: key,
      error: error.message || 'Upload failed'
    }
  }
}

/**
 * Get file from R2 bucket
 */
export async function getFromR2(
  bucket: R2Bucket,
  key: string
): Promise<R2ObjectBody | null> {
  try {
    const object = await bucket.get(key)
    return object
  } catch (error) {
    console.error('R2 get error:', error)
    return null
  }
}

/**
 * Delete file from R2 bucket
 */
export async function deleteFromR2(
  bucket: R2Bucket,
  key: string
): Promise<boolean> {
  try {
    await bucket.delete(key)
    return true
  } catch (error) {
    console.error('R2 delete error:', error)
    return false
  }
}

/**
 * Generate R2 file key for KYC documents
 */
export function generateKYCFileKey(
  userId: number,
  fileType: 'id_front' | 'id_back' | 'selfie' | 'proof_address',
  extension: string
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `kyc-submissions/user-${userId}/${fileType}-${timestamp}-${random}.${extension}`
}

/**
 * Generate profile picture key
 */
export function generateProfilePictureKey(userId: number, extension: string): string {
  return `profile-pictures/user-${userId}-profile.${extension}`
}

/**
 * Validate file type for KYC
 */
export function isValidKYCFileType(mimeType: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
  return allowedTypes.includes(mimeType.toLowerCase())
}

/**
 * Validate file size (max 10MB for KYC documents)
 */
export function isValidFileSize(sizeInBytes: number, maxMB: number = 10): boolean {
  const maxBytes = maxMB * 1024 * 1024
  return sizeInBytes <= maxBytes
}

/**
 * Get file extension from mime type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf'
  }
  return map[mimeType.toLowerCase()] || 'bin'
}

/**
 * Parse multipart form data (simplified for Cloudflare Workers)
 * In production, you'd use a proper multipart parser
 */
export async function parseMultipartFormData(
  request: Request
): Promise<{
  files: Array<{ name: string; data: ArrayBuffer; type: string; size: number }>
  fields: Record<string, string>
}> {
  const contentType = request.headers.get('content-type') || ''
  
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Content-Type must be multipart/form-data')
  }
  
  // For Cloudflare Workers, we'll use FormData API
  const formData = await request.formData()
  
  const files: Array<{ name: string; data: ArrayBuffer; type: string; size: number }> = []
  const fields: Record<string, string> = {}
  
  for (const [name, value] of formData.entries()) {
    if (value instanceof File) {
      // It's a file
      const arrayBuffer = await value.arrayBuffer()
      files.push({
        name: name,
        data: arrayBuffer,
        type: value.type,
        size: value.size
      })
    } else {
      // It's a text field
      fields[name] = value.toString()
    }
  }
  
  return { files, fields }
}

/**
 * Generate signed URL for temporary access (using R2 presigned URLs)
 * Note: R2 doesn't have built-in presigned URLs like S3, so we'll use our own API
 */
export function generateSignedAccessURL(fileKey: string, expiresInHours: number = 24): string {
  // In production, you'd generate a JWT token with expiry
  // For now, we'll use our internal API endpoint with a token
  const token = btoa(JSON.stringify({
    key: fileKey,
    exp: Date.now() + (expiresInHours * 60 * 60 * 1000)
  }))
  
  return `/api/kyc/file/${encodeURIComponent(fileKey)}?token=${token}`
}
