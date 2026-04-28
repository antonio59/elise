import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Send weekly summary email every Saturday at 9:00 UTC
crons.weekly(
  "send weekly summary email",
  {
    dayOfWeek: "saturday",
    hourUTC: 9,
    minuteUTC: 0,
  },
  internal.weeklyEmail.sendWeeklySummary,
  {},
);

// Send photo feature announcement once (checks flag internally)
crons.daily(
  "send photo feature announcement if not sent",
  {
    hourUTC: 10,
    minuteUTC: 0,
  },
  internal.photos.sendFeatureAnnouncement,
  {},
);

export default crons;
