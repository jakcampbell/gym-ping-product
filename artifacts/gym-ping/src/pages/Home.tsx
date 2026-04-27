import { useState } from "react";

const stats = [
  { label: "Weekly goal", value: "3 days" },
  { label: "Completed", value: "2 days" },
  { label: "Current streak", value: "2 days" },
];

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
  const [response, setResponse] = useState<"went" | "skipped" | null>(null);

  return (
    <div className="min-h-screen bg-[hsl(220_20%_97%)]">
      {/* Nav */}
      <nav className="border-b border-[hsl(220_15%_88%)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[hsl(220_90%_56%)] font-semibold tracking-tight text-lg">
            Gym Ping
          </span>
          <span className="text-sm text-[hsl(220_10%_55%)]">by Jakob Campbell</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-[hsl(220_90%_56%/0.10)] text-[hsl(220_90%_56%)] text-sm font-medium">
          Stay consistent. Stay strong.
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[hsl(220_15%_15%)] tracking-tight leading-tight mb-5">
          Gym Ping
        </h1>
        <p className="text-lg text-[hsl(220_10%_45%)] max-w-xl mx-auto leading-relaxed">
          A simple daily reminder to keep you accountable and help you build the gym habit that actually sticks.
        </p>
        <p className="mt-4 text-sm text-[hsl(220_10%_55%)]">
          A project by <span className="font-medium text-[hsl(220_15%_20%)]">Jakob Campbell</span>
        </p>
      </section>

      {/* Info Sections */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-[hsl(220_15%_90%)] p-7 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${s.tagColor}`}
              >
                {s.tag}
              </span>
              <h2 className="text-lg font-semibold text-[hsl(220_15%_15%)] mb-2">{s.title}</h2>
              <p className="text-sm text-[hsl(220_10%_45%)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Interface */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[hsl(220_15%_15%)]">Daily Check-In</h2>
          <p className="text-sm text-[hsl(220_10%_55%)] mt-1">See how the product works</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-[hsl(220_15%_90%)] shadow-md overflow-hidden">
            {/* Header strip */}
            <div className="bg-[hsl(220_90%_56%)] px-6 py-4">
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Today's Ping</p>
              <p className="text-white text-xl font-semibold mt-1">
                Are you going to the gym today?
              </p>
            </div>

            {/* Buttons */}
            <div className="px-6 pt-6 pb-5">
              {response === null ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setResponse("went")}
                    className="flex-1 bg-[hsl(220_90%_56%)] hover:bg-[hsl(220_90%_50%)] text-white font-semibold rounded-xl py-3 text-sm transition-colors duration-150 shadow-sm"
                  >
                    I went
                  </button>
                  <button
                    onClick={() => setResponse("skipped")}
                    className="flex-1 bg-[hsl(220_20%_94%)] hover:bg-[hsl(220_20%_90%)] text-[hsl(220_15%_30%)] font-semibold rounded-xl py-3 text-sm transition-colors duration-150"
                  >
                    I skipped
                  </button>
                </div>
              ) : (
                <div
                  className={`rounded-xl p-4 text-center ${
                    response === "went"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {response === "went" ? (
                    <>
                      <p className="font-semibold text-base">Logged! Great work.</p>
                      <p className="text-sm mt-0.5 opacity-80">Keep the streak going.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-base">Noted. Tomorrow is a fresh start.</p>
                      <p className="text-sm mt-0.5 opacity-80">We'll ping you again.</p>
                    </>
                  )}
                  <button
                    onClick={() => setResponse(null)}
                    className="mt-3 text-xs underline opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-[hsl(220_15%_92%)] px-6 py-5">
              <p className="text-xs text-[hsl(220_10%_55%)] font-medium uppercase tracking-widest mb-4">
                This Week
              </p>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-bold text-[hsl(220_90%_56%)]">{stat.value.split(" ")[0]}</p>
                    <p className="text-[10px] text-[hsl(220_10%_55%)] leading-tight mt-0.5">
                      {stat.label}
                      <br />
                      <span className="font-medium">{stat.value.split(" ").slice(1).join(" ")}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[hsl(220_10%_55%)]">Weekly progress</span>
                  <span className="text-xs font-semibold text-[hsl(220_15%_20%)]">2 / 3 days</span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(220_20%_92%)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[hsl(220_90%_56%)] transition-all duration-500"
                    style={{ width: "66.7%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(220_15%_88%)] py-8 text-center">
        <p className="text-sm text-[hsl(220_10%_55%)]">
          Gym Ping &mdash; built by <span className="font-medium text-[hsl(220_15%_25%)]">Jakob Campbell</span>
        </p>
      </footer>
    </div>
  );
}
