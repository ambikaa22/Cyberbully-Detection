import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">SafeChat</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 md:py-32 space-y-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Chat safely with real-time cyberbullying detection
            </h1>
            <p className="text-muted-foreground text-xl">
              Our platform automatically detects and masks harmful content in real-time, creating a safer online
              environment for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/detect">
                <Button size="lg" className="gap-2">
                  Try Detection <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Real-time Detection</h3>
              <p className="text-muted-foreground">
                Our ML model identifies cyberbullying content in multiple languages as you type.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Profanity Masking</h3>
              <p className="text-muted-foreground">
                Automatically masks inappropriate language while preserving conversation flow.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Private Chat Rooms</h3>
              <p className="text-muted-foreground">Create and manage private chat rooms with invite-only access.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 SafeChat. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

