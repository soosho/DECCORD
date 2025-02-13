"use client"

import { OTPInput as BaseOTPInput } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

interface OTPInputProps {
  maxLength?: number
  value: string
  onChange: (value: string) => void
}

export function OTPInput({ maxLength = 6, value, onChange }: OTPInputProps) {
  return (
    <BaseOTPInput
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      render={({ slots }) => (
        <div className="flex gap-2">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className={cn(
                "relative h-14 w-10 rounded-md bg-muted text-center text-2xl font-semibold",
                "after:absolute after:inset-x-0 after:top-[50%] after:h-px after:bg-muted-foreground/25"
              )}
            >
              {slot.char ? (
                <div className="relative z-10 h-full w-full pt-2">
                  {slot.char}
                </div>
              ) : (
                <Dot className="h-full w-full pt-2 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      )}
    />
  )
}