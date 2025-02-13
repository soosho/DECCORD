import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendLoginOTPEmailParams {
  email: string
  otp: string
}

export async function sendLoginOTPEmail({ email, otp }: SendLoginOTPEmailParams) {
  try {
    await resend.emails.send({
      from: 'Your App <no-reply@auth.hueyhops.com>',
      to: email,
      subject: 'Login Verification Code',
      html: `
        <h1>Login Verification Code</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    })
  } catch (error) {
    console.error('Failed to send login OTP email:', error)
    throw new Error('Failed to send verification code')
  }
}