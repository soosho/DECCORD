import { Button } from "@/components/ui/button"
import { DribbbleIcon, TwitchIcon, TwitterIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TeamMember {
  name: string
  title: string
  bio: string
  imageUrl: string
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    title: "Founder & CEO",
    bio: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
    imageUrl: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Jane Doe",
    title: "Engineering Manager",
    bio: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
    imageUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  // ... add more team members as needed
]

interface TeamProps {
  className?: string
}

export function Team({ className }: TeamProps) {
  return (
    <section className={cn("py-8 sm:py-12", className)}>
      <div className="flex flex-col justify-center px-6 lg:px-8 max-w-screen-xl mx-auto gap-16">
        <div className="text-center max-w-2xl mx-auto">
          <b className="text-center text-secondary text-base">
            We&apos;re hiring!
          </b>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Meet Our Team
          </h2>
          <p className="mt-6 text-base sm:text-lg">
            Our philosophy is simple — hire a team of diverse, passionate people
            and foster a culture that empowers you to do your best work.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row-reverse sm:justify-center gap-3">
            <Button size="lg" className="font-semibold">
              Open Positions
            </Button>
            <Button size="lg" variant="outline" className="font-semibold">
              About Us
            </Button>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {teamMembers.map((member) => (
            <div key={member.name}>
              <Image
                src={member.imageUrl}
                alt={member.name}
                className="w-full aspect-square rounded-lg object-cover bg-secondary"
                width={600}
                height={600}
              />
              <h3 className="mt-4 text-lg font-bold">{member.name}</h3>
              <p className="text-foreground/60">{member.title}</p>
              <p className="mt-3 text-muted-foreground">{member.bio}</p>
              <div className="mt-4 flex items-center gap-2.5">
                <Button
                  className="bg-muted hover:bg-muted text-muted-foreground shadow-none"
                  size="icon"
                  asChild
                >
                  <Link href="#" target="_blank">
                    <TwitterIcon className="stroke-muted-foreground" />
                  </Link>
                </Button>
                <Button
                  className="bg-muted hover:bg-muted text-muted-foreground shadow-none"
                  size="icon"
                  asChild
                >
                  <Link href="#" target="_blank">
                    <DribbbleIcon className="stroke-muted-foreground" />
                  </Link>
                </Button>
                <Button
                  className="bg-muted hover:bg-muted text-muted-foreground shadow-none"
                  size="icon"
                  asChild
                >
                  <Link href="#" target="_blank">
                    <TwitchIcon className="stroke-muted-foreground" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}