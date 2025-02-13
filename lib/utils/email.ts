import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTPEmail(email: string, otp: string, type: 'signup' | 'signin' | 'reset') {
  const subject = {
    signup: 'Verify your email',
    signin: 'Login verification code',
    reset: 'Reset your password',
  }[type]

  await resend.emails.send({
    from: 'noreply@auth.hueyhops.com',
    to: email,
    subject: subject,
    html: `
      <h1>${subject}</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `
  })
}