Product Requirements Document (PRD): “Niece Bookshelf” Web App

Product Purpose & Overview

Objective: Create a lively, public-facing digital bookshelf for a 13-year-old user (your niece) to share the books she's reading, post reviews, and showcase her manga-style artwork. The app will include a stats dashboard for her reading/activity habits and borrow design elements reminiscent of Webtoon and other “isekai”/manga fandom platforms.

Target User: Pre-teen/teen readers, manga and webtoon fans (centered around niece as main user but open/public for peers and readers to follow).

Key Features

1. Public Bookshelf & Review Publishing

User profile (“Niece” or customizable username/avatar)

Public bookshelf: Books currently reading, previously read, and wish list

Add books by search or manual entry (title, author, cover image)

Star/Favorite books

Write and publish reviews per book: rating (emoji or stars), text, image upload for illustrated reviews

Comments on reviews (public, but moderation tools for safety)

2. Manga & Artwork Gallery

Section to upload and showcase her own manga drawings and webtoon-style panels

Accept multiple image formats; batch uploads for multi-page projects

Gallery view with likes/comments (moderated)

Tag uploads with series name, genre, style (isekai, fantasy, slice of life, etc.)

Optionally support webtoon-style vertical scrolling or “chapter” groupings

3. Stats Tracker (Private—shown only to niece)

Reading stats: Books completed, pages read, genres explored, review count, streaks

Artwork stats: Images uploaded, likes/comments received

Visual charts: Weekly/monthly/yearly progress, favorite genres, reading time

Achievements & badges (“Manga Master,” “Review Pro,” “Foresaken Fan”)

4. Discover & Social

Public facing “Explore” page: See recent reviews and artwork from all users (or only niece if single-user app at first)

“Follow” and “like” other profiles, reviews, artwork

Optional: Social login (Google, Discord), or pseudonymous registration for privacy/safety

5. Admin & Moderation Controls

Content moderation: Flag, review, and remove inappropriate comments/art

Adjustable privacy: Private bookshelf, artwork, or reviews; only public-facing content if approved by niece

Security for young users: Email verification, strict data protections (COPPA/GDPR compliance)

Visual & UX Design

Inspired by Webtoon and “isekai” manga: Bright, colorful, whimsical interface, panels, avatars, and fantasy motifs

Mobile-first layout (for tablet/phones); vertical-scrolling for bookshelf and artwork (like webtoon chapters)

Customizable themes: Choose colors and backgrounds; fantasy or manga style overlays and stickers

Technical & Backend

Frontend: React/Next.js (or similar modern JS SPA framework), responsive design, anime/manga-focused UI kits

Backend: Node.js/Express, Supabase or Firebase for database and authentication, file storage for artwork/images

APIs: Book search API (Google Books, OpenLibrary), optional AI-based manga style tag detection

Data & Privacy: Secure user data management, image/file upload controls; personal stats seen only by user (niece)

Metrics & Success Criteria

Books logged and reviews published per month

Artwork uploads and engagement (likes/comments)

User retention (streaks maintained, return visits)

Safe and positive public engagement (low flagged content percentage)

Future Enhancements

Group bookshelf (friends/fans can join/share)

Embedded reader for webtoons/manga with custom uploads (if copyright-compliant)

Gamification: Quests for reviews, artwork challenges

Parental dashboard for safety controls (optional)