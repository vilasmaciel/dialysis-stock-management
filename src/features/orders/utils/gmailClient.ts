/// <reference types="gapi" />
/// <reference types="gapi.auth2" />

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
const SCOPES = 'https://www.googleapis.com/auth/gmail.send'

export interface EmailData {
  to: string
  cc?: string[]
  subject: string
  body: string
  attachment: Blob
  attachmentFilename: string
}

/**
 * Initialize Google API client
 */
export async function initializeGapi(): Promise<void> {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * Check if user is signed in and has Gmail permissions
 */
export function isSignedIn(): boolean {
  const authInstance = gapi.auth2.getAuthInstance()
  if (!authInstance) return false

  const user = authInstance.currentUser.get()
  return user.hasGrantedScopes(SCOPES)
}

/**
 * Sign in user and request Gmail permissions
 */
export async function signInWithGmail(): Promise<void> {
  const authInstance = gapi.auth2.getAuthInstance()
  await authInstance.signIn({
    scope: SCOPES,
  })
}

/**
 * Convert Blob to Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Create RFC 2822 formatted email with attachment
 */
async function createMimeMessage(data: EmailData): Promise<string> {
  const { to, cc, subject, body, attachment, attachmentFilename } = data

  const boundary = '-------314159265358979323846'
  const delimiter = `\r\n--${boundary}\r\n`
  const closingDelimiter = `\r\n--${boundary}--`

  // Convert attachment to base64
  const attachmentBase64 = await blobToBase64(attachment)

  // Build email headers
  let message = ''
  message += `To: ${to}\r\n`
  if (cc && cc.length > 0) {
    message += `Cc: ${cc.join(', ')}\r\n`
  }
  message += `Subject: ${subject}\r\n`
  message += 'MIME-Version: 1.0\r\n'
  message += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`

  // Email body
  message += delimiter
  message += 'Content-Type: text/plain; charset="UTF-8"\r\n\r\n'
  message += body + '\r\n'

  // Attachment
  message += delimiter
  message += 'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n'
  message += 'Content-Transfer-Encoding: base64\r\n'
  message += `Content-Disposition: attachment; filename="${attachmentFilename}"\r\n\r\n`
  message += attachmentBase64
  message += closingDelimiter

  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Send email with attachment using Gmail API
 */
export async function sendEmailWithAttachment(data: EmailData): Promise<{ id: string }> {
  const raw = await createMimeMessage(data)

  const response = await gapi.client.gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw,
    },
  })

  return response.result
}

/**
 * Get daily send count from localStorage
 */
export function getDailySendCount(): number {
  const today = new Date().toDateString()
  const stored = localStorage.getItem('gmail_send_count')

  if (!stored) return 0

  const data = JSON.parse(stored)
  if (data.date !== today) return 0

  return data.count
}

/**
 * Increment daily send count
 */
export function incrementSendCount(): void {
  const today = new Date().toDateString()
  const count = getDailySendCount() + 1

  localStorage.setItem('gmail_send_count', JSON.stringify({
    date: today,
    count,
  }))
}

/**
 * Check if daily limit reached (5 emails/day)
 */
export function isDailyLimitReached(): boolean {
  return getDailySendCount() >= 5
}
