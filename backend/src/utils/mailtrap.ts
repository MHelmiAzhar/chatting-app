import { MailtrapClient } from 'mailtrap'

const TOKEN = process.env.MAILTRAP_TOKEN ?? ''
const INBOX_ID = process.env.MAILTRAP_INBBOX_ID ?? ''

console.log('ini token', TOKEN)
console.log('ini id', INBOX_ID)

const client = new MailtrapClient({
  token: TOKEN,
  testInboxId: parseInt(INBOX_ID)
})

export default client
