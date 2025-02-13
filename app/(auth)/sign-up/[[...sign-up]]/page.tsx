'use client'

import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function SignUpPage() {
  const { theme } = useTheme()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        appearance={{
          baseTheme: theme === "dark" ? undefined : dark,
          elements: {
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            card: "bg-background",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background text-foreground",
            footerActionLink: "text-primary hover:text-primary/90",
          }
        }} 
      />
    </div>
  )
}