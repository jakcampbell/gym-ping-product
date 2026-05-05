import { Router, type IRouter } from "express";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db, gymLogsTable } from "@workspace/db";
import { CreateGymLogBody, GetGymStatsResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.post("/gym-logs", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateGymLogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = (req as any).userId as string;
  const today = new Date().toISOString().split("T")[0];

  const [log] = await db
    .insert(gymLogsTable)
    .values({ userId, date: today, status: parsed.data.status })
    .onConflictDoUpdate({
      target: [gymLogsTable.userId, gymLogsTable.date],
      set: { status: parsed.data.status },
    })
    .returning();

  res.status(201).json(log);
});

router.get("/gym-logs/stats", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).userId as string;

  // Current week boundaries (Monday–Sunday)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ...
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekStart = monday.toISOString().split("T")[0];
  const weekEnd = sunday.toISOString().split("T")[0];
  const today = now.toISOString().split("T")[0];

  // Fetch this week's logs
  const weekLogs = await db
    .select()
    .from(gymLogsTable)
    .where(
      and(
        eq(gymLogsTable.userId, userId),
        gte(gymLogsTable.date, weekStart),
        lte(gymLogsTable.date, weekEnd),
      ),
    );

  const completed = weekLogs.filter((l) => l.status === "went").length;
  const weeklyGoal = 3;

  // Today's status
  const todayLog = weekLogs.find((l) => l.date === today);
  const todayStatus = (todayLog?.status ?? null) as "went" | "skipped" | null;

  // Streak: count consecutive days ending today where status = "went"
  const allLogs = await db
    .select()
    .from(gymLogsTable)
    .where(eq(gymLogsTable.userId, userId))
    .orderBy(desc(gymLogsTable.date));

  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  for (const log of allLogs) {
    const logDate = log.date;
    const cursorDate = cursor.toISOString().split("T")[0];
    if (logDate === cursorDate) {
      if (log.status === "went") {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    } else if (logDate < cursorDate) {
      // Gap — streak broken
      break;
    }
  }

  res.json(
    GetGymStatsResponse.parse({ weeklyGoal, completed, streak, todayStatus }),
  );
});

export default router;
