import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import ReadingStreak from "../components/ReadingStreak";
import WritingStreak from "../components/WritingStreak";
import DailyPrompts from "../components/DailyPrompts";
import IdeasVault from "../components/IdeasVault";
import QuoteCollection from "../components/QuoteCollection";
import ArtProgressTimeline from "../components/ArtProgressTimeline";
import MonthlyWrapped from "../components/MonthlyWrapped";
import OnboardingTour from "../components/OnboardingTour";
import SetGoalModal from "../components/dashboard/SetGoalModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import CurrentlyReading from "../components/dashboard/CurrentlyReading";
import ReactionsStats from "../components/dashboard/ReactionsStats";
import ReadingGoalProgress from "../components/dashboard/ReadingGoalProgress";
import QuickActions from "../components/dashboard/QuickActions";
import RecentBooks from "../components/dashboard/RecentBooks";
import RecentArtworks from "../components/dashboard/RecentArtworks";
import RecentPhotos from "../components/dashboard/RecentPhotos";

const Dashboard: React.FC = () => {
  usePageAnnouncement("Dashboard");
  usePageMeta({ title: "Dashboard", description: "Your dashboard" });
  const stats = useQuery(api.users.getStats);
  const books = useQuery(api.books.getMyBooks);
  const artworks = useQuery(api.artworks.getMyArtworks);
  const photos = useQuery(api.photos.getMyPhotos);
  const goalProgress = useQuery(api.readingGoals.getGoalProgress);
  const writingStats = useQuery(api.writings.getStats);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactionStats = useQuery((api as any).reactions.getDashboardStats);
  const setGoal = useMutation(api.readingGoals.setGoal);
  const userProfile = useQuery(api.users.getProfile);
  const setOnboardingSeen = useMutation(api.users.setOnboardingSeen);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Show onboarding on first visit
  const shouldShowOnboarding =
    userProfile !== undefined &&
    userProfile !== null &&
    userProfile.hasSeenOnboarding !== true &&
    !showTour;

  React.useEffect(() => {
    if (shouldShowOnboarding) {
      setShowTour(true);
    }
  }, [shouldShowOnboarding]);

  const handleTourComplete = useCallback(async () => {
    setShowTour(false);
    await setOnboardingSeen();
  }, [setOnboardingSeen]);

  const handleTourSkip = useCallback(async () => {
    setShowTour(false);
    await setOnboardingSeen();
  }, [setOnboardingSeen]);

  const recentBooks = useMemo(() => books?.slice(0, 6) ?? [], [books]);
  const recentArtworks = useMemo(() => artworks?.slice(0, 4) ?? [], [artworks]);
  const recentPhotos = useMemo(() => photos?.slice(0, 4) ?? [], [photos]);
  const currentlyReading = useMemo(
    () => books?.filter((b: { status: string }) => b.status === "reading") ?? [],
    [books],
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <DashboardHeader onStartTour={() => setShowTour(true)} />

      {/* Streaks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ReadingStreak />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WritingStreak />
      </div>

      {/* Daily Prompts */}
      <DailyPrompts />

      {/* Ideas & Quotes */}
      <div className="grid md:grid-cols-2 gap-6">
        <IdeasVault />
        <QuoteCollection />
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} writingStats={writingStats} />

      {/* Currently Reading */}
      <CurrentlyReading books={currentlyReading} />

      {/* Reactions Stats */}
      <ReactionsStats reactionStats={reactionStats} />

      {/* Reading Goal Progress */}
      <ReadingGoalProgress
        goalProgress={goalProgress}
        onSetGoal={() => setShowGoalModal(true)}
      />

      {/* Quick Actions */}
      <QuickActions stats={stats} writingStats={writingStats} />

      {/* Recent Books */}
      <RecentBooks books={books} recentBooks={recentBooks} />

      {/* Monthly Wrapped */}
      <MonthlyWrapped />

      {/* Art Progress */}
      <ArtProgressTimeline />

      {/* Recent Artworks */}
      <RecentArtworks artworks={artworks} recentArtworks={recentArtworks} />

      {/* Recent Photos */}
      <RecentPhotos photos={photos} recentPhotos={recentPhotos} />

      {/* Onboarding Tour */}
      {showTour && (
        <OnboardingTour
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}

      {/* Set Goal Modal */}
      <SetGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        currentGoal={goalProgress?.goal}
        year={goalProgress?.year ?? new Date().getFullYear()}
        onSave={async (targetBooks, targetPages) => {
          await setGoal({
            year: goalProgress?.year ?? new Date().getFullYear(),
            targetBooks,
            targetPages: targetPages || undefined,
          });
          setShowGoalModal(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
