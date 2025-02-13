import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatRules() {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 pr-4">
        <div className="space-y-3">
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">1.</span>
              <div>
                <p>Be respectful to all users</p>
                <p className="text-xs text-muted-foreground mt-0.5">Warning → 24h ban → 7-day ban</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">2.</span>
              <div>
                <p>No spamming or excessive messages</p>
                <p className="text-xs text-muted-foreground mt-0.5">24h ban → 7-day ban → Permanent</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">3.</span>
              <div>
                <p>Use appropriate language</p>
                <p className="text-xs text-muted-foreground mt-0.5">Warning → 24h ban → 7-day ban</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">4.</span>
              <div>
                <p>Stay on topic in language-specific channels</p>
                <p className="text-xs text-muted-foreground mt-0.5">Warning → 24h ban</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">5.</span>
              <div>
                <p>No advertising or self-promotion</p>
                <p className="text-xs text-muted-foreground mt-0.5">7-day ban → Permanent</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">6.</span>
              <div>
                <p>Follow moderators' instructions</p>
                <p className="text-xs text-muted-foreground mt-0.5">24h ban → 7-day ban</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[20px]">7.</span>
              <div>
                <p>No harassment or threats</p>
                <p className="text-xs text-muted-foreground mt-0.5">Immediate permanent ban</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  )
}