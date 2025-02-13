"use client"

import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { Features2 } from "@/components/home/features2"
import { Features3 } from "@/components/home/features3"
import Pricing from "@/components/home/pricing"
import { Separator } from "@/components/ui/separator"
import { Cta } from "@/components/home/cta"
import { Faq } from "@/components/home/faq"
import { Blog } from "@/components/home/blog"
import { Stats } from "@/components/home/stats"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <Hero />
        <Separator className="my-8" />
        <Features />
        <Separator className="my-8" />
        <Features2 />
        <Separator className="my-8" />
        <Features3 />
        <Separator className="my-8" />
        <Pricing />
        <Separator className="my-8" />
        <Blog />
        <Separator className="my-8" />
        <Faq />
        <Separator className="my-8" />
        <Cta />
        <Separator className="my-8" />
        <Stats className="mt-16" />
      </main>
      <Footer />
    </div>
  )
}