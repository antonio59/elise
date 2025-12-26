"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api, useAuth } from "@/lib/convex";
import MetricCard from "@/components/MetricCard";
import AddBookPanel from "@/components/admin/AddBookPanel";
import AddArtPanel from "@/components/admin/AddArtPanel";
import ImageUpload from "@/components/ImageUpload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Id } from "@/convex/_generated/dataModel";
import {
  BarChart3,
  BookPlus,
  Palette,
  Sticker,
  Settings,
  FolderOpen,
  ThumbsUp,
  Heart,
  Share2,
  Flame,
  Loader2,
  ShieldAlert,
} from "lucide-react";

type Tab =
  | "overview"
  | "add-book"
  | "add-art"
  | "stickers"
  | "settings"
  | "manage";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const books =
    useQuery(api.books.getAllBooks, token ? { token } : "skip") ?? [];
  const artworks =
    useQuery(api.artworks.getAllArtworks, token ? { token } : "skip") ?? [];
  const reviews =
    useQuery(api.reviews.getAllReviews, token ? { token } : "skip") ?? [];
  const siteSettings = useQuery(api.siteSettings.get);
  const engagementStats = useQuery(api.likes.getAllStats);
  const stickers = useQuery(api.stickers.getAll) ?? [];

  const updateSettings = useMutation(api.siteSettings.update);
  const updateHeroImage = useMutation(api.siteSettings.updateHeroImage);
  const createSticker = useMutation(api.stickers.create);
  const removeSticker = useMutation(api.stickers.remove);

  // Sticker form
  const [stickerName, setStickerName] = useState("");
  const [stickerCategory, setStickerCategory] = useState("");
  const [stickerStorageId, setStickerStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [stickerPreview, setStickerPreview] = useState<string | null>(null);
  const [stickerSaving, setStickerSaving] = useState(false);

  // Settings form
  const [siteName, setSiteName] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    if (siteSettings) {
      setSiteName(siteSettings.siteName || "Elise's World");
      setHeroTitle(siteSettings.heroTitle || "My Reading");
      setHeroSubtitle(siteSettings.heroSubtitle || "Adventures");
      setHeroDescription(siteSettings.heroDescription || "");
      setHeroImagePreview(siteSettings.heroImageUrl || null);
    }
  }, [siteSettings]);

  // Auth guard - redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  // Show auth required message
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <ShieldAlert className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to access the admin dashboard.
          </p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </Card>
      </main>
    );
  }

  const totalBooks = books.length;
  const booksRead = books.filter((b) => b.status === "read").length;
  const totalArtworks = artworks.length;
  const totalPages = books.reduce((sum, b) => sum + (b.pagesTotal || 0), 0);

  const handleAddSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !stickerName || !stickerStorageId) return;
    setStickerSaving(true);
    try {
      await createSticker({
        token,
        name: stickerName,
        storageId: stickerStorageId,
        category: stickerCategory || undefined,
      });
      setStickerName("");
      setStickerCategory("");
      setStickerStorageId(null);
      setStickerPreview(null);
    } catch (err) {
      console.error(err);
    }
    setStickerSaving(false);
  };

  const handleDeleteSticker = async (stickerId: Id<"stickers">) => {
    if (!token || !confirm("Delete this sticker?")) return;
    await removeSticker({ token, stickerId });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSettingsSaving(true);
    setSettingsMessage("");
    try {
      await updateSettings({
        token,
        siteName,
        heroTitle,
        heroSubtitle,
        heroDescription,
      });
      setSettingsMessage("Settings saved!");
      setTimeout(() => setSettingsMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSettingsMessage("Failed to save");
    }
    setSettingsSaving(false);
  };

  const handleHeroImageUpload = async (
    storageId: Id<"_storage">,
    url: string,
  ) => {
    if (!token) return;
    setHeroImagePreview(url);
    try {
      await updateHeroImage({ token, storageId });
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "add-book", label: "Add Book", icon: BookPlus },
    { key: "add-art", label: "Add Art", icon: Palette },
    { key: "stickers", label: "Stickers", icon: Sticker },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "manage", label: "Manage", icon: FolderOpen },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your books, art, and settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md"
                    : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-800"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Books Read"
                value={booksRead}
                subtitle={`of ${totalBooks} total`}
                icon="📚"
                variant="emerald"
              />
              <MetricCard
                title="Total Pages"
                value={totalPages.toLocaleString()}
                subtitle="pages read"
                icon="📖"
                variant="mint"
              />
              <MetricCard
                title="Artworks"
                value={totalArtworks}
                subtitle="pieces created"
                icon="🎨"
                variant="gold"
              />
              <MetricCard
                title="Stickers"
                value={stickers.length}
                subtitle="custom stickers"
                icon="🏷️"
                variant="default"
              />
            </div>

            {/* Engagement Stats */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Engagement
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <ThumbsUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Total Likes
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {engagementStats?.totalLikes ?? 0}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                      <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Total Loves
                      </p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {engagementStats?.totalLoves ?? 0}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <Share2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Total Shares
                      </p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {engagementStats?.totalShares ?? 0}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                      <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        Engagement
                      </p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {engagementStats?.totalEngagement ?? 0}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Books */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Books
              </h2>
              {books.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No books added yet.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {books.slice(0, 5).map((book) => (
                    <Card
                      key={book._id}
                      padding="sm"
                      className="flex items-center gap-4"
                    >
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          📚
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {book.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {book.author}
                        </p>
                        {book.rating && (
                          <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < book.rating! ? "text-amber-400" : "text-gray-300 dark:text-neutral-600"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          book.status === "read"
                            ? "success"
                            : book.status === "reading"
                              ? "info"
                              : "default"
                        }
                      >
                        {book.status === "read"
                          ? "Read"
                          : book.status === "reading"
                            ? "Reading"
                            : "Wishlist"}
                      </Badge>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Artworks */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Artworks
              </h2>
              {artworks.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No artworks added yet.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {artworks.slice(0, 4).map((art) => (
                    <div key={art._id}>
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
                        <img
                          src={art.imageUrl}
                          alt={art.title || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                        {art.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Book */}
        {activeTab === "add-book" && (
          <AddBookPanel
            token={token}
            onComplete={() => setActiveTab("overview")}
          />
        )}

        {/* Add Art */}
        {activeTab === "add-art" && (
          <AddArtPanel
            token={token}
            onComplete={() => setActiveTab("overview")}
          />
        )}

        {/* Stickers */}
        {activeTab === "stickers" && (
          <div className="max-w-xl">
            <Card padding="lg" className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Create Sticker
              </h2>
              <form onSubmit={handleAddSticker} className="space-y-5">
                <ImageUpload
                  token={token || ""}
                  label="Sticker Image *"
                  aspectRatio="square"
                  currentImageUrl={stickerPreview}
                  onUploadComplete={(storageId, url) => {
                    setStickerStorageId(storageId);
                    setStickerPreview(url);
                  }}
                />
                <Input
                  label="Sticker Name *"
                  value={stickerName}
                  onChange={(e) => setStickerName(e.target.value)}
                  placeholder="e.g., Happy Star"
                  required
                />
                <Input
                  label="Category"
                  value={stickerCategory}
                  onChange={(e) => setStickerCategory(e.target.value)}
                  placeholder="e.g., Emotions, Animals, Stars"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={stickerSaving || !stickerName || !stickerStorageId}
                  isLoading={stickerSaving}
                >
                  Create Sticker
                </Button>
              </form>
            </Card>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              My Stickers ({stickers.length})
            </h3>
            {stickers.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No custom stickers yet.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {stickers.map((sticker) => (
                  <div key={sticker._id} className="group relative">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700">
                      <img
                        src={sticker.imageUrl}
                        alt={sticker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-center mt-1 truncate text-gray-600 dark:text-gray-400">
                      {sticker.name}
                    </p>
                    <button
                      onClick={() => handleDeleteSticker(sticker._id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="max-w-xl">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Site Settings
              </h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    My Avatar
                  </h3>
                  <div className="mb-4">
                    <ImageUpload
                      token={token || ""}
                      label="Upload your avatar"
                      aspectRatio="square"
                      currentImageUrl={heroImagePreview}
                      onUploadComplete={handleHeroImageUpload}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      This will be your profile picture on the homepage!
                    </p>
                  </div>
                </div>

                <Input
                  label="Site Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Elise's World"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Hero Title (Line 1)"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="My Reading"
                  />
                  <Input
                    label="Hero Title (Line 2)"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Adventures"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    placeholder="Welcome to my little corner of the internet..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={settingsSaving}
                  isLoading={settingsSaving}
                >
                  Save Settings
                </Button>

                {settingsMessage && (
                  <p
                    className={`text-center text-sm ${settingsMessage.includes("Failed") ? "text-red-500" : "text-green-600"}`}
                  >
                    {settingsMessage}
                  </p>
                )}
              </form>
            </Card>
          </div>
        )}

        {/* Manage */}
        {activeTab === "manage" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                All Books ({books.length})
              </h2>
              {books.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No books to manage.
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {books.map((book) => (
                    <Card
                      key={book._id}
                      padding="sm"
                      className="flex items-center gap-4"
                    >
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="w-10 h-14 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center text-sm">
                          📚
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {book.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {book.author}
                        </p>
                      </div>
                      {book.rating && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < book.rating! ? "text-amber-400" : "text-gray-300 dark:text-neutral-600"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                All Artworks ({artworks.length})
              </h2>
              {artworks.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No artworks to manage.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {artworks.map((art) => (
                    <div
                      key={art._id}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800"
                    >
                      <img
                        src={art.imageUrl}
                        alt={art.title || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
