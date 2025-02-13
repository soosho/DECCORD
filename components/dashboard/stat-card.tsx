import { cn } from "@/lib/utils"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  className?: string
}

export function StatCard({ title, value, description, className }: StatCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn("bg-secondary/50 shadow-none cursor-help", className)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {value}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p className="text-xs">{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}