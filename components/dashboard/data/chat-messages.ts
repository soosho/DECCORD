import { Message } from "@/types/chat"

export const demoMessages: Record<string, Message[]> = {
  english: [
    {
      id: "1",
      content: "Welcome to our support chat! How can I help you today?",
      timestamp: new Date("2025-02-11T00:00:00"),
      isUser: false,
      channel: "english",
      user: {
        id: "support1",
        username: "Sarah Smith",
        avatar: "/avatars/support-1.png",
        isPro: true,
        level: 45
      }
    },
    {
      id: "2",
      content: "I need help with my mining rewards calculation",
      timestamp: new Date("2025-02-11T00:01:00"),
      isUser: true,
      channel: "english",
      user: {
        id: "user1",
        username: "John Doe",
        avatar: "/avatars/user-1.png",
        isPro: false,
        level: 12
      }
    }
  ],
  russian: [
    {
      id: "3",
      content: "Здравствуйте! Чем могу помочь?",
      timestamp: new Date("2025-02-11T09:30:00"),
      isUser: false,
      channel: "russian",
      user: {
        id: "support2",
        username: "Ivan Petrov",
        avatar: "/avatars/support-2.png",
        isPro: true,
        level: 67
      }
    },
    {
      id: "4",
      content: "Как мне увеличить скорость майнинга?",
      timestamp: new Date("2025-02-11T09:31:00"),
      isUser: true,
      channel: "russian",
      user: {
        id: "user2",
        username: "Boris K.",
        avatar: "/avatars/user-2.png",
        isPro: true,
        level: 34
      }
    }
  ],
  // Add two messages for each remaining channel...
}