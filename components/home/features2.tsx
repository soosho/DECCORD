import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Fingerprint,
  KeyRound,
  Shield,
  Star,
  Unlock,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const features = [
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

interface Features2Props {
  className?: string
}

export function Features2({ className }: Features2Props) {
  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="container max-w-[1400px] mx-auto px-8 lg:px-16">
        <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-black tracking-tight max-w-lg">
          Security Features That Matter
        </h2>
        <div className="mt-6 md:mt-8 w-full mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <Accordion defaultValue="item-0" type="single" className="w-full">
              {features.map(({ title, description, icon: Icon }, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="data-[state=open]:border-b-2 data-[state=open]:border-primary"
                >
                  <AccordionTrigger className="text-lg [&>svg]:hidden">
                    <div className="flex items-center gap-4">
                      <Icon className="h-5 w-5" />
                      {title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground">
                    {description}
                    <div className="mt-6 mb-2 md:hidden">
                      <DotLottieReact
                        src="https://lottie.host/a8a722dd-260a-45aa-b414-17a2f716f92f/cefGUgDVYw.lottie"
                        loop
                        autoplay
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Media */}
          <div className="hidden md:block w-full h-full">
            <DotLottieReact
              src="https://lottie.host/a8a722dd-260a-45aa-b414-17a2f716f92f/cefGUgDVYw.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </section>
  )
}