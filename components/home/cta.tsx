import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CtaProps {
  className?: string
  heading?: string
  description?: string
  buttons?: {
    primary?: {
      text: string
      url: string
    }
    secondary?: {
      text: string
      url: string
    }
  }
}

export function Cta({ 
  className,
  heading = "Ready to Get Started?",
  description = "Join thousands of users protecting their applications with our authentication system.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "/sign-up",
    },
    secondary: {
      text: "Learn More",
      url: "/docs",
    },
  },
}: CtaProps) {
  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="container max-w-[1400px] mx-auto px-8 lg:px-16">
        <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h3>
            <p className="text-muted-foreground lg:text-lg">{description}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {buttons.secondary && (
              <Button variant="outline" asChild>
                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
              </Button>
            )}
            {buttons.primary && (
              <Button asChild>
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}