import { cn } from "@/lib/utils"
import {
  Fingerprint,
  KeyRound,
  Shield,
  Star,
  Unlock,
  UserCheck
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeaturesProps {
  className?: string
}

const features: Feature[] = [
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Multi-layered security with rate limiting, CSRF protection, and secure session management.",
  },
  {
    icon: UserCheck,
    title: "Email Verification",
    description: "Secure email verification system with OTP support to ensure user authenticity.",
  },
  {
    icon: Fingerprint,
    title: "Device Fingerprinting",
    description: "Advanced device fingerprinting to detect and prevent suspicious login attempts.",
  },
  {
    icon: KeyRound,
    title: "2FA Authentication",
    description: "Two-factor authentication support with TOTP and backup codes for enhanced security.",
  },
  {
    icon: Unlock,
    title: "Password Recovery",
    description: "Secure password reset flow with time-limited tokens and email verification.",
  },
  {
    icon: Star,
    title: "Role-Based Access",
    description: "Flexible role-based access control for managing user permissions and resources.",
  },
]

export function Features({ className }: FeaturesProps) {
  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="container max-w-[1400px] mx-auto px-8 lg:px-16">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-center">
          Main Features
        </h2>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col border rounded-xl p-8"
            >
              <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}