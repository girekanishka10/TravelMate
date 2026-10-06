import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <p className="font-serif text-2xl">TravelMate</p>
        <div className="flex gap-2">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm">
            Login
          </Link>
          <Link href="/signup" className="rounded-full bg-forest px-4 py-2 text-sm text-white">
            Sign Up
          </Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-16 pt-6">
        <div
          className="absolute inset-x-5 top-0 h-[420px] rounded-[2rem] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(30,26,22,0.15), rgba(30,26,22,0.55)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="relative flex min-h-[420px] flex-col justify-end p-8 text-white md:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">TravelMate</p>
          <h1 className="mt-2 max-w-xl font-serif text-4xl leading-tight md:text-6xl">
            Find people who travel like you.
          </h1>
          <p className="mt-4 max-w-lg text-white/90">
            Discover compatible travel groups, create your own group, or find the perfect guide for your next
            adventure.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink">
              Login
            </Link>
            <Link href="/signup" className="rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 md:grid-cols-3">
        <Feature
          title="Explore"
          body="Find travel groups that match your destination, dates, budget and travel preferences."
          image="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80"
        />
        <Feature
          title="Create Your Own Group"
          body="Create your trip and choose compatible travelers yourself."
          image="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80"
        />
        <Feature
          title="Find a Guide"
          body="Find a suitable guide for your group based on destination, experience, ratings and interests."
          image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80"
        />
      </section>
    </main>
  );
}

function Feature({ title, body, image }: { title: string; body: string; image: string }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] bg-card tm-shadow">
      <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="p-5">
        <h2 className="font-serif text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
      </div>
    </article>
  );
}
