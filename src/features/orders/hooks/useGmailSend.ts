import { useMutation } from '@tanstack/react-query'
import { sendEmailWithAttachment, incrementSendCount } from '../utils/gmailClient'
import type { EmailData } from '../utils/gmailClient'

export function useGmailSend() {
  return useMutation({
    mutationFn: async (emailData: EmailData) => {
      const result = await sendEmailWithAttachment(emailData)
      incrementSendCount()
      return result
    },
  })
}
