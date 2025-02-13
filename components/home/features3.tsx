import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, UserCheck, Fingerprint, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface Features3Props {
  className?: string
}

export function Features3({ className }: Features3Props) {
  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="container max-w-[1400px] mx-auto px-8 lg:px-16">
        <h2 className="text-3xl leading-10 sm:text-4xl md:text-[40px] md:leading-[3.25rem] font-black tracking-tight">
          Enhanced Security: <br />
          Advanced Protection for Your Applications
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Card 1 */}
          <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 1 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl">
              <DotLottieReact
                src="https://lottie.host/a8a722dd-260a-45aa-b414-17a2f716f92f/cefGUgDVYw.lottie"
                loop
                autoplay
              />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Advanced Security
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <Shield className="shrink-0" />
                  <p className="-mt-0.5">
                    Multi-layered security with rate limiting and CSRF protection
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <UserCheck className="shrink-0" />
                  <p className="-mt-0.5">
                    Secure email verification with OTP support
                  </p>
                </div>
              </li>
            </ul>

            <Button className="mt-12 w-full">
              Learn more about security <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {/* Media 1 Desktop */}
          <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2">
            <DotLottieReact
              src="https://lottie.host/a8a722dd-260a-45aa-b414-17a2f716f92f/cefGUgDVYw.lottie"
              loop
              autoplay
            />
          </div>

          {/* Media 2 Desktop */}
          <div className="hidden md:block border border-border/80 bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2">
            <DotLottieReact
              src="https://lottie.host/a8a722dd-260a-45aa-b414-17a2f716f92f/cefGUgDVYw.lottie"
              loop
              autoplay
            />
          </div>
          {/* Card 2 */}
          <div className="bg-muted rounded-xl pt-6 md:pt-8 pb-6 px-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 2 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background border rounded-xl">
              <DotLottieReact
                src="https://lottie.host/a8a722dd-260a-45aa-b414-17a2f716f92f/cefGUgDVYw.lottie"
                loop
                autoplay
              />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Authentication
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <Fingerprint className="shrink-0" />
                  <p className="-mt-0.5">
                    Advanced device fingerprinting for suspicious login detection
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <KeyRound className="shrink-0" />
                  <p className="-mt-0.5">
                    Two-factor authentication with TOTP support
                  </p>
                </div>
              </li>
            </ul>

            <Button className="mt-12 w-full">
              Explore authentication <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}