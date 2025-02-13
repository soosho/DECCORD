'use client'

import { Suspense } from "react"
import { UserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

function AccountContent() {
  const { theme } = useTheme()

  return (
    <div className="w-full max-w-6xl">
      <UserProfile
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          elements: {
            rootBox: "w-full",
            card: "bg-card border shadow-sm rounded-lg p-6",
            navbar: "hidden",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            profileSectionTitle: "text-foreground",
            profileSectionTitleText: "text-foreground font-bold",
            profileSectionContent: "text-muted-foreground",
            inputLabel: "text-foreground",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            formButtonReset: "bg-muted text-muted-foreground hover:bg-muted/90",
            formFieldInput: "bg-background text-foreground",
            formFieldErrorText: "text-destructive",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            avatarImageActionsUpload: "text-primary hover:text-primary/90",
            avatarImageActionsRemove: "text-destructive hover:text-destructive/90",
            "profileSectionPrimaryButton__username": "hidden"
          }
        }}
        path="/account"
      />
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col items-center p-4 md:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <AccountContent />
      </Suspense>
    </div>
  )
}