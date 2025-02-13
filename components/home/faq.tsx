import { cn } from "@/lib/utils"
import {
  Shield,
  Lock,
  KeyRound,
  UserCheck,
  Mail,
  Fingerprint,
} from "lucide-react"

interface FaqProps {
  className?: string
}

const faq = [
  {
    icon: Shield,
    question: "How secure is your authentication system?",
    answer: "Our system uses industry-standard encryption and security practices, including JWT tokens, bcrypt password hashing, and rate limiting protection.",
  },
  {
    icon: Lock,
    question: "What happens if I get locked out?",
    answer: "We provide multiple account recovery options including email verification, backup codes, and secure password reset flows.",
  },
  {
    icon: KeyRound,
    question: "How does two-factor authentication work?",
    answer: "We support TOTP-based 2FA using authenticator apps like Google Authenticator or Authy, with backup codes for emergency access.",
  },
  {
    icon: UserCheck,
    question: "Can I manage multiple user roles?",
    answer: "Yes, our role-based access control system lets you define custom roles and permissions for different user types.",
  },
  {
    icon: Mail,
    question: "How does email verification work?",
    answer: "We send secure one-time verification codes to verify email addresses and prevent unauthorized account access.",
  },
  {
    icon: Fingerprint,
    question: "What is device fingerprinting?",
    answer: "Our system tracks unique device characteristics to detect suspicious login attempts and prevent unauthorized access.",
  },
]

export function Faq({ className }: FaqProps) {
  return (
    <section className={cn("flex items-center justify-center py-24", className)}>
      <div className="container px-4 max-w-screen-lg mx-auto">
        <h2 className="text-4xl md:text-5xl !leading-[1.15] font-black tracking-tighter text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-lg text-center text-muted-foreground">
          Common questions about our authentication system
        </p>

        <div className="mt-12 grid md:grid-cols-2 rounded-xl gap-4">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 rounded-xl">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-3 mb-2 flex items-start gap-2 text-2xl font-bold tracking-tighter">
                <span>{question}</span>
              </div>
              <p className="text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}