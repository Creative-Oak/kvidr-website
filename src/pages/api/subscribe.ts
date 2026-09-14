import type {APIRoute} from 'astro'
import {Resend} from 'resend'
import {clientIp, rateLimit} from '../../lib/rate-limit'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  })

export const POST: APIRoute = async ({request}) => {
  const apiKey = import.meta.env.RESEND_API_KEY
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID
  const from = import.meta.env.RESEND_FROM_EMAIL
  const to = import.meta.env.CONTACT_TO_EMAIL

  if (!apiKey) {
    console.error('[subscribe] RESEND_API_KEY is not set')
    return json({message: 'The mailing list is not connected yet.'}, 503)
  }

  if (!rateLimit(`subscribe:${clientIp(request)}`, 5)) {
    return json({message: 'Too many attempts. Try again later.'}, 429)
  }

  let email = ''
  try {
    const body = await request.json()
    email = String(body?.email ?? '').trim().toLowerCase()
  } catch {
    return json({message: 'Could not read that request.'}, 400)
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return json({message: 'That email address does not look right.'}, 400)
  }

  const resend = new Resend(apiKey)

  try {
    if (audienceId) {
      const {error} = await resend.contacts.create({email, audienceId, unsubscribed: false})
      // Resend treats an existing contact as an error; to the person signing up
      // it is the same outcome, so do not leak list membership back to them.
      if (error && !/already exists/i.test(error.message ?? '')) throw new Error(error.message)
    } else if (from && to) {
      const {error} = await resend.emails.send({
        from,
        to,
        subject: 'kvidr — new signup',
        text: `${email} asked to be told when kvidr ships.`,
        replyTo: email,
      })
      if (error) throw new Error(error.message)
    } else {
      console.error('[subscribe] neither RESEND_AUDIENCE_ID nor FROM/TO is configured')
      return json({message: 'The mailing list is not connected yet.'}, 503)
    }

    return json({message: 'You are on the list. Thank you.'})
  } catch (error) {
    console.error('[subscribe]', error)
    return json({message: 'Something went wrong. Try again in a moment.'}, 502)
  }
}
