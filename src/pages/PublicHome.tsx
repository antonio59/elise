import React, { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SuggestBookModal from "../components/books/SuggestBookModal";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";
import HeroSection from "../components/home/HeroSection";
import FeaturedBooks from "../components/home/FeaturedBooks";
import Testimonials from "../components/home/Testimonials";
import FeaturedPhotos from "../components/home/FeaturedPhotos";
import FeaturedArt from "../components/home/FeaturedArt";
import FooterCTA from "../components/home/FooterCTA";

const PublicHome: React.FC = () => {
  usePageAnnouncement("Home");
  usePageMeta({ title: "Home", description: "Books, art & things I think about" });
  const books = useQuery(api.books.getReadBooks);
  const photos = useQuery(api.photos.getPublished, { limit: 6 });
  const siteSettings = useQuery(api.siteSettings.get);
  const wishlist = useQuery(api.books.getWishlist);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const nowReading = useMemo(() => {
    if (!books) return [];
    return books.filter((b: { status: string }) => b.status === "reading");
  }, [books]);

  const fiveStarBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((b: { rating?: number }) => b.rating === 5);
  }, [books]);

  const booksForGrid = useMemo(() => {
    if (!books) return [];
    return books.filter((b: { status: string }) => b.status !== "reading");
  }, [books]);

  return (
    <div className="min-h-screen">
      <HeroSection
        heroTitle={siteSettings?.heroTitle as string | undefined}
        heroSubtitle={siteSettings?.heroSubtitle as string | undefined}
        onSuggestClick={() => setShowSuggestModal(true)}
      />

      <FeaturedBooks
        books={books}
        booksForGrid={booksForGrid}
        nowReading={nowReading}
        fiveStarBooks={fiveStarBooks}
        wishlist={wishlist}
        onSuggestClick={() => setShowSuggestModal(true)}
      />

      <Testimonials books={books} />

      <FeaturedPhotos photos={photos ?? []} />

      <FeaturedArt />

      <FooterCTA onSuggestClick={() => setShowSuggestModal(true)} />

      <SuggestBookModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
      />
    </div>
  );
};

export default PublicHome;
