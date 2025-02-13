"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import Image from "next/image"
import { type Message, type User } from "@/types/chat"
import { demoMessages } from "./data/chat-messages"
import { formatMessageTime } from "@/lib/utils/format-date"
import { LanguageTabs } from "./language-tabs"
import { ChatRules } from "./chat-rules"

// Add a mock user for demo purposes at the top of the file after imports
const currentUser: User = {
  id: "current-user",
  username: "You",
  avatar: "/avatars/default.png",
  isPro: false,
  level: 1
}

export function ChatBox() {
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, Message[]>>(demoMessages)
  const [input, setInput] = useState("")
  const [activeChannel, setActiveChannel] = useState("english")
  const [showRules, setShowRules] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      timestamp: new Date(),
      isUser: true,
      channel: activeChannel,
      user: currentUser // Add the user property
    }

    setMessagesByChannel(prev => ({
      ...prev,
      [activeChannel]: [...prev[activeChannel], newMessage]
    }))
    setInput("")
  }

  const currentChannelMessages = messagesByChannel[activeChannel] || []

  return (
    <div className="flex flex-col gap-4">
      <LanguageTabs 
        activeChannel={activeChannel} 
        onChannelChange={setActiveChannel}
        onShowRules={() => setShowRules(true)}
      />
      
      <Card className="w-full flex flex-col sticky top-4 h-[calc(100vh-180px)]">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {showRules ? "Chat Rules & Guidelines" : "Chat Box"}
            </CardTitle>
            {showRules && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowRules(false)}
              >
                Back to Chat
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-hidden">
          {showRules ? (
            <ChatRules />
          ) : (
            <ScrollArea className="h-full -mr-4 pr-4">
              <div className="flex flex-col gap-6">
                {currentChannelMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-6 ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex ${message.isUser ? "flex-row-reverse" : "flex-row"} gap-3 max-w-[80%]`}>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <Image 
                            src={message.user.avatar} 
                            alt={message.user.username} 
                            width={24} 
                            height={24}
                          />
                        </div>
                      </div>
                      <div className={`flex flex-col ${message.isUser ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">{message.user.username}</span>
                          {message.user.isPro && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                              PRO
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Level: {message.user.level}
                        </span>
                        <div
                          className={`mt-0.1 rounded-lg px-3 py-1.5 ${
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <span className="text-xs"> {/* Added text size for message */}
                              {message.content}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
        {!showRules && (
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full gap-2">
              <Input
                placeholder={`Type a message in ${activeChannel}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}