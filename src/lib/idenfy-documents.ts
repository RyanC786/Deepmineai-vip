/**
 * iDenfy Document Fetching
 * Fetch document images from iDenfy after verification
 */

/**
 * Fetch document images from iDenfy
 * https://documentation.idenfy.com/API/ResultsDownload
 */
export async function fetchIdenfyDocuments(
  apiKey: string,
  apiSecret: string,
  scanRef: string
): Promise<{
  success: boolean
  documents?: {
    front?: { buffer: ArrayBuffer; mimeType: string }
    back?: { buffer: ArrayBuffer; mimeType: string }
    face?: { buffer: ArrayBuffer; mimeType: string }
  }
  error?: string
}> {
  try {
    const authToken = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    // Fetch document data from iDenfy
    const response = await fetch(`https://ivs.idenfy.com/api/v2/data?scanRef=${scanRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch iDenfy data:', response.status, errorText)
      return {
        success: false,
        error: `Failed to fetch documents: ${response.status}`
      }
    }
    
    const data = await response.json()
    
    // iDenfy provides fileUrls for document images
    const documents: any = {}
    
    // Fetch front image
    if (data.fileUrls?.FRONT) {
      const frontResponse = await fetch(data.fileUrls.FRONT, {
        headers: { 'Authorization': `Basic ${authToken}` }
      })
      
      if (frontResponse.ok) {
        documents.front = {
          buffer: await frontResponse.arrayBuffer(),
          mimeType: 'image/jpeg'
        }
      }
    }
    
    // Fetch back image
    if (data.fileUrls?.BACK) {
      const backResponse = await fetch(data.fileUrls.BACK, {
        headers: { 'Authorization': `Basic ${authToken}` }
      })
      
      if (backResponse.ok) {
        documents.back = {
          buffer: await backResponse.arrayBuffer(),
          mimeType: 'image/jpeg'
        }
      }
    }
    
    // Fetch face image (selfie)
    if (data.fileUrls?.FACE) {
      const faceResponse = await fetch(data.fileUrls.FACE, {
        headers: { 'Authorization': `Basic ${authToken}` }
      })
      
      if (faceResponse.ok) {
        documents.face = {
          buffer: await faceResponse.arrayBuffer(),
          mimeType: 'image/jpeg'
        }
      }
    }
    
    return {
      success: true,
      documents
    }
  } catch (error) {
    console.error('Error fetching iDenfy documents:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
