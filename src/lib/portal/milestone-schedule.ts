export type MilestoneScheduleInfo = {
  unlockAt: Date;
  regularDueAt: Date;
  graceCutoffAt: Date;
  isCompleted: boolean;
  isSubmitted: boolean;
  isRevision: boolean;
  isLocked: boolean;
  isOpen: boolean;
  isOnTime: boolean;
  isGracePeriod: boolean;
  isClosed: boolean;
  statusLabel: string;
  statusBadgeColor: "emerald" | "blue" | "amber" | "rose" | "slate";
};

/**
 * Calculates weekly submission window and unlock dates for an internship milestone.
 * 
 * Rules:
 * - Each week officially unlocks on Monday at 12:00 AM (00:00:00).
 * - Regular Submission Deadline: Sunday of that week at 11:59:59 PM.
 * - Grace Period (Late Submission): Sunday 11:59:59 PM to Monday 11:59:59 PM (24 hours).
 *   Submissions during this window are accepted but flagged as "Late Submission".
 * - Hard Cutoff: After Monday 11:59:59 PM, submissions are closed.
 * - Future weeks remain locked until their respective Monday 12:00 AM.
 */
export function calculateMilestoneSchedule(
  milestone: {
    week_number: number;
    due_at: string;
    status: string;
  },
  referenceNow: Date = new Date()
): MilestoneScheduleInfo {
  const baseDue = new Date(milestone.due_at);
  const regularDueAt = new Date(baseDue);
  const day = regularDueAt.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

  // Align regular deadline to Sunday 23:59:59 of that target week
  if (day === 6) {
    regularDueAt.setDate(regularDueAt.getDate() + 1);
  } else if (day !== 0) {
    regularDueAt.setDate(regularDueAt.getDate() + (7 - day));
  }
  regularDueAt.setHours(23, 59, 59, 999);

  // Unlock on Monday 00:00:00 (6 days prior to Sunday)
  const unlockAt = new Date(regularDueAt);
  unlockAt.setDate(unlockAt.getDate() - 6);
  unlockAt.setHours(0, 0, 0, 0);

  // Grace Cutoff: Monday 23:59:59 (exactly 24h after Sunday midnight)
  const graceCutoffAt = new Date(regularDueAt);
  graceCutoffAt.setDate(graceCutoffAt.getDate() + 1);
  graceCutoffAt.setHours(23, 59, 59, 999);

  const isCompleted = milestone.status === "completed";
  const isSubmitted = milestone.status === "submitted";
  const isRevision = milestone.status === "revision_requested";

  const isLocked = !isCompleted && !isSubmitted && !isRevision && referenceNow < unlockAt;
  const isClosed = !isCompleted && !isSubmitted && !isRevision && referenceNow > graceCutoffAt;
  const isGracePeriod = !isCompleted && !isSubmitted && !isRevision && referenceNow > regularDueAt && referenceNow <= graceCutoffAt;
  const isOnTime = !isCompleted && !isSubmitted && !isRevision && referenceNow >= unlockAt && referenceNow <= regularDueAt;
  const isOpen = isOnTime || isGracePeriod || isRevision;

  let statusLabel = "Upcoming";
  let statusBadgeColor: "emerald" | "blue" | "amber" | "rose" | "slate" = "slate";

  if (isCompleted) {
    statusLabel = "Graded & Approved (100/100)";
    statusBadgeColor = "emerald";
  } else if (isSubmitted) {
    statusLabel = "Submitted (Under Review)";
    statusBadgeColor = "blue";
  } else if (isRevision) {
    statusLabel = "Revision Requested";
    statusBadgeColor = "amber";
  } else if (isLocked) {
    statusLabel = "Locked (Opens Monday)";
    statusBadgeColor = "slate";
  } else if (isOnTime) {
    statusLabel = "Open (On-Time Window)";
    statusBadgeColor = "emerald";
  } else if (isGracePeriod) {
    statusLabel = "Grace Period (Late Submission)";
    statusBadgeColor = "amber";
  } else if (isClosed) {
    statusLabel = "Closed (Past Deadline)";
    statusBadgeColor = "rose";
  }

  return {
    unlockAt,
    regularDueAt,
    graceCutoffAt,
    isCompleted,
    isSubmitted,
    isRevision,
    isLocked,
    isOpen,
    isOnTime,
    isGracePeriod,
    isClosed,
    statusLabel,
    statusBadgeColor,
  };
}
