import { useLocation } from "wouter";

const sections = [
  {
    id: "problem",
    tag: "Problem",
    tagColor: "bg-red-100 text-red-700",
    title: "Motivation drops when it matters most",
    body: "People struggle to go to the gym consistently because motivation fades at the moment of decision — when deciding whether to go or skip. Without a push at the right time, skipping becomes the easy default.",
  },
  {
    id: "solution",
    tag: "Solution",
    tagColor: "bg-blue-100 text-blue-700",
    title: "A ping at the right moment",
    body: "Gym Ping sends a simple, well-timed reminder each day to keep you accountable. No complex scheduling, no guilt trips — just a gentle nudge that fits naturally into your routine.",
  },
  {
    id: "users",
    tag: "Target User",
    tagColor: "bg-violet-100 text-violet-700",
    title: "Built for busy people",
    body: "Gym Ping is designed for college students and young professionals with packed schedules who want to stay active but need a consistent external prompt to make it happen.",
  },
  {
    id: "metrics",
    tag: "Metrics",
    tagColor: "bg-emerald-100 text-emerald-700",
    title: "Progress you can see",
    body: "We track what actually matters — weekly gym attendance, consistency rate, and user retention — so you always know how you're doing and can build on your momentum.",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,97%)]">
      {/* Nav */}
      <nav className="border-b border-[hsl(220,15%,88%)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[hsl(220,90%,56%)] font-semibold tracking-tight text-lg">
            Gym Ping
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/sign-in")}
              className="text-sm text-[hsl(220,10%,45%)] hover:text-[hsl(220,15%,20%)] transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => setLocation("/sign-up")}
              className="text-sm bg-[hsl(220,90%,56%)] hover:bg-[hsl(220,90%,50%)] text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-[hsl(220,90%,56%,0.10)] text-[hsl(220,90%,56%)] text-sm font-medium">
          Stay consistent. Stay strong.
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[hsl(220,15%,15%)] tracking-tight leading-tight mb-5">
          Gym Ping
        </h1>
        <p className="text-lg text-[hsl(220,10%,45%)] max-w-xl mx-auto leading-relaxed">
          A simple daily reminder to keep you accountable and help you build the gym habit that actually sticks.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setLocation("/sign-up")}
            className="bg-[hsl(220,90%,56%)] hover:bg-[hsl(220,90%,50%)] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm text-sm"
          >
            Start tracking for free
          </button>
          <button
            onClick={() => setLocation("/sign-in")}
            className="text-[hsl(220,10%,45%)] hover:text-[hsl(220,15%,20%)] font-medium px-4 py-3 text-sm transition-colors"
          >
            Sign in →
          </button>
        </div>
        <p className="mt-4 text-sm text-[hsl(220,10%,55%)]">
          A project by <span className="font-medium text-[hsl(220,15%,20%)]">Jakob Campbell</span>
        </p>
      </section>

      {/* Info Sections */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-[hsl(220,15%,90%)] p-7 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${s.tagColor}`}
              >
                {s.tag}
              </span>
              <h2 className="text-lg font-semibold text-[hsl(220,15%,15%)] mb-2">{s.title}</h2>
              <p className="text-sm text-[hsl(220,10%,45%)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="bg-[hsl(220,90%,56%)] rounded-2xl px-8 py-12 text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to stay consistent?</h2>
          <p className="text-white/80 mb-6 text-sm">Join Gym Ping and start building the habit today.</p>
          <button
            onClick={() => setLocation("/sign-up")}
            className="bg-white text-[hsl(220,90%,56%)] font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            Create your free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(220,15%,88%)] py-8 text-center">
        <p className="text-sm text-[hsl(220,10%,55%)]">
          Gym Ping &mdash; built by <span className="font-medium text-[hsl(220,15%,25%)]">Jakob Campbell</span>
        </p>
      </footer>
    </div>
  );
}
