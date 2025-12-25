# Elise - Improvement Plan

## Phase 1: Security Hardening

- [x] Password hashing with bcrypt
- [x] Session management with 30-day tokens
- [x] Input sanitization for user content
- [x] Rate limiting on auth endpoints
- [ ] Session cleanup scheduled job for expired tokens

## Phase 2: Code Quality

- [x] TypeScript throughout
- [x] Convex schema with proper types
- [x] ESLint configuration
- [ ] Replace `any` types with proper types
- [ ] Add error boundaries

## Phase 3: Features (Completed)

- [x] Authentication (email/password with roles)
- [x] Bookshelf with reading status/progress
- [x] Art gallery with uploads and series
- [x] Rich text reviews (TipTap editor)
- [x] Social features (follow, like, share)
- [x] Dashboard with stats and achievements
- [x] Parent/admin content moderation
- [x] Dark/light theme
- [x] Search with Google Books API

## Phase 4: Future Enhancements

- [ ] Manga-style UI decorations (sakura, speech bubbles)
- [ ] Smooth page transitions
- [ ] Onboarding flow for new users
- [ ] Visitor comments without login
- [ ] Reading streaks calendar visualization
- [ ] Batch uploads for multi-page artwork
