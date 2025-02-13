import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { channels } from "./data/channels"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LanguageTabsProps {
  activeChannel: string
  onChannelChange: (channel: string) => void
  onShowRules: () => void
}

export function LanguageTabs({ activeChannel, onChannelChange, onShowRules }: LanguageTabsProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <Tabs defaultValue={activeChannel} onValueChange={onChannelChange}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 h-auto gap-1 p-1">
            {channels.map((channel) => (
              <TabsTrigger 
                key={channel.value}
                value={channel.value}
                className="text-xs py-1.5 flex items-center gap-1"
              >
                <Image 
                  src={channel.icon} 
                  alt={`${channel.label} flag`} 
                  width={16} 
                  height={12} 
                />
                {channel.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
      <CardFooter className="px-3 pb-3 pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs" 
          onClick={onShowRules}
        >
          <Book className="h-4 w-4 mr-2" />
          View Chat Rules
        </Button>
      </CardFooter>
    </Card>
  )
}