import type {APIRoute} from 'astro'
import {Resend} from 'resend'
import {clientIp, rateLimit} from '../../lib/rate-limit'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  })

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const POST: APIRoute = async ({request}) => {
  const apiKey = import.meta.env.RESEND_API_KEY
  const from = import.meta.env.RESEND_FROM_EMAIL
  const to = import.meta.env.CONTACT_TO_EMAIL

  if (!apiKey || !from || !to) {
    console.error('[contact] Resend is not fully configured')
    return json({message: 'The contact form is not connected yet.'}, 503)
  }

  if (!rateLimit(`contact:${clientIp(request)}`, 4)) {
    return json({message: 'Too many messages. Try again later.'}, 429)
  }

  let name = ''
  let email = ''
  let message = ''
  let honeypot = ''

  try {
    const body = await request.json()
    name = String(body?.name ?? '').trim()
    email = String(body?.email ?? '').trim()
    message = String(body?.message ?? '').trim()
    honeypot = String(body?.company ?? '').trim()
  } catch {
    return json({message: 'Could not read that request.'}, 400)
  }

  // A field no human sees, and every naive bot fills in.
  if (honeypot) return json({message: 'Thank you — your message is on its way.'})

  if (!name || name.length > 120) return json({message: 'Please add your name.'}, 400)
  if (!EMAIL.test(email)) return json({message: 'That email address does not look right.'}, 400)
  if (message.length < 10) return json({message: 'Please write a little more.'}, 400)
  if (message.length > 5000) return json({message: 'That message is too long.'}, 400)

  const resend = new Resend(apiKey)

  try {
    const {error} = await resend.emails.send({
      from,
      to,
      subject: `kvidr — message from ${name}`,
      replyTo: `${name} <${email}>`,
      text: `${name} <${email}>\n\n${message}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    })
    if (error) throw new Error(error.message)

    return json({message: 'Thank you — your message is on its way.'})
  } catch (error) {
    console.error('[contact]', error)
    return json({message: 'Something went wrong. Try again in a moment.'}, 502)
  }
}
