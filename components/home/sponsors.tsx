import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
} from "@/components/home/logos"

export function Sponsors() {
  return (
    <section className="flex items-center justify-center py-8 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center max-w-screen-lg mx-auto">
          <p className="text-center text-xl text-muted-foreground">
            Trusted by leading companies worldwide
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
          </div>
        </div>
      </div>
    </section>
  )
}