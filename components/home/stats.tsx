import { Badge } from "@/components/ui/badge"
import { Verified } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsProps {
  className?: string
}

export function Stats({ className }: StatsProps) {
  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Trusted by developers worldwide
          </h2>
          {/* Fixed: Moved Badge outside of paragraph */}
          <p className="mt-4 text-muted-foreground sm:text-xl">
            Join thousands of developers and companies building amazing things
          </p>
          <div className="mt-2">
          <Badge variant="secondary" className="gap-1 ml-4"><Verified className="size-4 shrink-0" />+7% this month</Badge>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-muted">
            <div className="flex flex-col px-4 py-8 text-center">
              <dt className="text-lg font-medium text-muted-foreground">
                Active Users
              </dt>
              <dd className="text-4xl font-extrabold text-foreground md:text-5xl">
                15K+
              </dd>
            </div>

            <div className="flex flex-col px-4 py-8 text-center">
              <dt className="text-lg font-medium text-muted-foreground">
                Downloads
              </dt>
              <dd className="text-4xl font-extrabold text-foreground md:text-5xl">
                250K
              </dd>
            </div>

            <div className="flex flex-col px-4 py-8 text-center">
              <dt className="text-lg font-medium text-muted-foreground">
                GitHub Stars
              </dt>
              <dd className="text-4xl font-extrabold text-foreground md:text-5xl">
                1.2K
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}