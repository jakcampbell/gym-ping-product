import { useUser, useClerk } from "@clerk/react";
import { useGetGymStats, useCreateGymLog, getGetGymStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useGetGymStats();

  const logMutation = useCreateGymLog({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGymStatsQueryKey() });
      },
    },
  });

  const handleLog = (status: "went" | "skipped") => {
    logMutation.mutate({ data: { status } });
  };

  const completed = stats?.completed ?? 0;
  const weeklyGoal = stats?.weeklyGoal ?? 3;
  const streak = stats?.streak ?? 0;
  const todayStatus = stats?.todayStatus ?? null;
  const progress = Math.min(completed / weeklyGoal, 1);

  return (
    <div className="min-h-screen bg-[hsl(220,20%,97%)]">
      {/* Nav */}
      <nav className="border-b border-[hsl(220,15%,88%)] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[hsl(220,90%,56%)] font-semibold tracking-tight text-lg">
            Gym Ping
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[hsl(220,10%,45%)] hidden sm:block">
              {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? ""}
            </span>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="text-sm text-[hsl(220,10%,55%)] hover:text-[hsl(220,15%,20%)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(220,15%,15%)]">
            Hey{user?.firstName ? `, ${user.firstName}` : ""}! 👋
          </h1>
          <p className="text-[hsl(220,10%,55%)] mt-1">Ready to crush it today?</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-[hsl(220,15%,90%)] shadow-md overflow-hidden">
            {/* Header strip */}
            <div className="bg-[hsl(220,90%,56%)] px-6 py-4">
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Today's Ping</p>
              <p className="text-white text-xl font-semibold mt-1">
                Did you go to the gym today?
              </p>
            </div>

            {/* Buttons */}
            <div className="px-6 pt-6 pb-5">
              {isLoading ? (
                <div className="h-12 rounded-xl bg-[hsl(220,20%,94%)] animate-pulse" />
              ) : todayStatus === null ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleLog("went")}
                    disabled={logMutation.isPending}
                    className="flex-1 bg-[hsl(220,90%,56%)] hover:bg-[hsl(220,90%,50%)] disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors duration-150 shadow-sm"
                  >
                    I went ✓
                  </button>
                  <button
                    onClick={() => handleLog("skipped")}
                    disabled={logMutation.isPending}
                    className="flex-1 bg-[hsl(220,20%,94%)] hover:bg-[hsl(220,20%,90%)] disabled:opacity-60 text-[hsl(220,15%,30%)] font-semibold rounded-xl py-3 text-sm transition-colors duration-150"
                  >
                    I skipped
                  </button>
                </div>
              ) : (
                <div className={`rounded-xl p-4 text-center ${
                  todayStatus === "went"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-orange-50 text-orange-700"
                }`}>
                  {todayStatus === "went" ? (
                    <>
                      <p className="font-semibold text-base">Logged! Great work.</p>
                      <p className="text-sm mt-0.5 opacity-80">Keep the streak going.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-base">Noted. Tomorrow is a fresh start.</p>
                      <p className="text-sm mt-0.5 opacity-80">We'll remind you again.</p>
                    </>
                  )}
                  <button
                    onClick={() => handleLog(todayStatus === "went" ? "skipped" : "went")}
                    disabled={logMutation.isPending}
                    className="mt-3 text-xs underline opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Change response
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-[hsl(220,15%,92%)] px-6 py-5">
              <p className="text-xs text-[hsl(220,10%,55%)] font-medium uppercase tracking-widest mb-4">
                This Week
              </p>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-12 rounded-lg bg-[hsl(220,20%,94%)] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-[hsl(220,90%,56%)]">{weeklyGoal}</p>
                    <p className="text-[10px] text-[hsl(220,10%,55%)] leading-tight mt-0.5">
                      Weekly<br /><span className="font-medium">goal</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[hsl(220,90%,56%)]">{completed}</p>
                    <p className="text-[10px] text-[hsl(220,10%,55%)] leading-tight mt-0.5">
                      Days<br /><span className="font-medium">completed</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[hsl(220,90%,56%)]">{streak}</p>
                    <p className="text-[10px] text-[hsl(220,10%,55%)] leading-tight mt-0.5">
                      Day<br /><span className="font-medium">streak</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[hsl(220,10%,55%)]">Weekly progress</span>
                  <span className="text-xs font-semibold text-[hsl(220,15%,20%)]">
                    {completed} / {weeklyGoal} days
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(220,20%,92%)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[hsl(220,90%,56%)] transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[hsl(220,15%,88%)] py-8 text-center">
        <p className="text-sm text-[hsl(220,10%,55%)]">
          Gym Ping &mdash; built by <span className="font-medium text-[hsl(220,15%,25%)]">Jakob Campbell</span>
        </p>
      </footer>
    </div>
  );
}
