# Changelog

All notable changes to this project will be documented in this file.
## [Unreleased]

### Bug Fixes

- Remove no-op string replace in IdeasVault, delete stale bun.lock
- Add internal migration to fix userId mismatch between books and userProfiles
- Remove conflicting CSP meta tag that blocked Convex WebSocket
- Add legacy windowExpiresAt field to rateLimits schema
- RateLimits schema + quotes index to resolve Convex deploy failure
- Add missing setLikingId calls in PublicGallery handleLike
- **security**: Resolve critical backend and frontend issues
- **security**: Replace substring check with hostname validation for Google Books URLs
- Prioritize Convex storage URL for hi-res covers, upgrade zoom at search time
- Change desktop grid to 5 cols, improve color contrast, silence dev-only console warnings
- Change remaining book grids from 6 to 5 columns on desktop
- Change desktop grid to 5 cols, improve color contrast, silence dev-only console warnings
- Change book grid to 5 columns max on desktop (matching izzy)
- Deprioritize storage thumbnails in CoverImage fallback chain
- Use DOMParser for HTML sanitization instead of regex
- Resolve eslint no-explicit-any in migrations.ts
- Re-enable schema validation on elise production
- Prioritize high-res Google Books URLs over blurry storage thumbnails
- Upgrade cover art to high-res — add migration + remove curl effect
- Add auth cleanup migration, guard empty allowlist, temp disable validation
- Replace v.any() with v.id('users'), re-enable schema validation, use indexes
- Add coverImageUrl to all Book type interfaces across pages
- Add coverImageUrl to all Book type interfaces across pages
- Resolve cover storage URLs server-side via ctx.storage.getUrl()
- Remove userId index filtering for single-user site
- Resolve brace-expansion security vulnerability
- Strict hostname validation for Google Books URLs (CodeQL #5, #6)
- Pin eslint to ^9.x (react-hooks plugin incompatible with eslint 10), add missing canvas-confetti + vitest deps
- Sharper covers — upgrade Google Books zoom to 3/5, lazy loading
- Add canvas-confetti to package.json and regenerate lock file
- Resolve merge conflicts with main (keep concurrent storeAll + env-var CONVEX_DEPLOYMENT)
- Address codebase review findings across backend and frontend
- Resolve merge conflicts with main
- **auth**: Hardcode convex site URL as fallback in auth.config.ts
- **auth**: Resolve sign-in loop and lint errors in AuthContext

### CI/CD

- Remove invalid --severity flag from OSV Scanner workflow
- Fix OSV Scanner workflow action paths and upgrade upload-sarif to v4
- Fix changelog workflow race condition, add security parser, backfill #30
- Add automatic changelog workflow
- Add automatic changelog workflow
- Add automatic changelog workflow

### Changes

- Refactor OSV Scanner setup and execution steps
- Add OSV Scanner workflow for vulnerability scanning

This workflow scans for vulnerabilities in the codebase using the OSV Scanner and uploads the results in SARIF format to GitHub Security tab. It is triggered on pull requests, pushes to main or master branches, and on a weekly schedule.
- Merge branch 'main' of https://github.com/antonio59/elise
- Merge branch 'main' of https://github.com/antonio59/elise
- Merge branch 'main' of https://github.com/antonio59/elise
- Fix accessibility and interaction issues across components (#29)
- Merge pull request #22 from antonio59/dependabot/npm_and_yarn/minor-patch-d5db63d792

Bump the minor-patch group with 7 updates
- Bump the minor-patch group with 7 updates

Bumps the minor-patch group with 7 updates:

| Package | From | To |
| --- | --- | --- |
| [convex](https://github.com/get-convex/convex-backend/tree/HEAD/npm-packages/convex) | `1.34.0` | `1.34.1` |
| [lucide-react](https://github.com/lucide-icons/lucide/tree/HEAD/packages/lucide-react) | `1.0.1` | `1.7.0` |
| [vitest](https://github.com/vitest-dev/vitest/tree/HEAD/packages/vitest) | `4.1.1` | `4.1.2` |
| [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/typescript-eslint) | `8.57.2` | `8.58.0` |
| [vite](https://github.com/vitejs/vite/tree/HEAD/packages/vite) | `8.0.2` | `8.0.3` |
| [@rollup/rollup-darwin-arm64](https://github.com/rollup/rollup) | `4.60.0` | `4.60.1` |
| [@rollup/rollup-linux-x64-gnu](https://github.com/rollup/rollup) | `4.60.0` | `4.60.1` |


Updates `convex` from 1.34.0 to 1.34.1
- [Release notes](https://github.com/get-convex/convex-backend/releases)
- [Changelog](https://github.com/get-convex/convex-backend/blob/main/npm-packages/convex/CHANGELOG.md)
- [Commits](https://github.com/get-convex/convex-backend/commits/HEAD/npm-packages/convex)

Updates `lucide-react` from 1.0.1 to 1.7.0
- [Release notes](https://github.com/lucide-icons/lucide/releases)
- [Commits](https://github.com/lucide-icons/lucide/commits/1.7.0/packages/lucide-react)

Updates `vitest` from 4.1.1 to 4.1.2
- [Release notes](https://github.com/vitest-dev/vitest/releases)
- [Commits](https://github.com/vitest-dev/vitest/commits/v4.1.2/packages/vitest)

Updates `typescript-eslint` from 8.57.2 to 8.58.0
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/typescript-eslint/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.58.0/packages/typescript-eslint)

Updates `vite` from 8.0.2 to 8.0.3
- [Release notes](https://github.com/vitejs/vite/releases)
- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)
- [Commits](https://github.com/vitejs/vite/commits/create-vite@8.0.3/packages/vite)

Updates `@rollup/rollup-darwin-arm64` from 4.60.0 to 4.60.1
- [Release notes](https://github.com/rollup/rollup/releases)
- [Changelog](https://github.com/rollup/rollup/blob/master/CHANGELOG.md)
- [Commits](https://github.com/rollup/rollup/compare/v4.60.0...v4.60.1)

Updates `@rollup/rollup-linux-x64-gnu` from 4.60.0 to 4.60.1
- [Release notes](https://github.com/rollup/rollup/releases)
- [Changelog](https://github.com/rollup/rollup/blob/master/CHANGELOG.md)
- [Commits](https://github.com/rollup/rollup/compare/v4.60.0...v4.60.1)

---
updated-dependencies:
- dependency-name: convex
  dependency-version: 1.34.1
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: lucide-react
  dependency-version: 1.7.0
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: minor-patch
- dependency-name: vitest
  dependency-version: 4.1.2
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: typescript-eslint
  dependency-version: 8.58.0
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: minor-patch
- dependency-name: vite
  dependency-version: 8.0.3
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: "@rollup/rollup-darwin-arm64"
  dependency-version: 4.60.1
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: "@rollup/rollup-linux-x64-gnu"
  dependency-version: 4.60.1
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: minor-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
- Merge pull request #20 from antonio59/dependabot/npm_and_yarn/minor-patch-cf38323bd8

Bump the minor-patch group with 7 updates
- Bump the minor-patch group with 7 updates

Bumps the minor-patch group with 7 updates:

| Package | From | To |
| --- | --- | --- |
| [@convex-dev/auth](https://github.com/get-convex/convex-auth) | `0.0.90` | `0.0.91` |
| [lucide-react](https://github.com/lucide-icons/lucide/tree/HEAD/packages/lucide-react) | `1.0.0` | `1.0.1` |
| [react-router-dom](https://github.com/remix-run/react-router/tree/HEAD/packages/react-router-dom) | `7.13.1` | `7.13.2` |
| [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) | `0.4.26` | `0.5.2` |
| [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/typescript-eslint) | `8.57.1` | `8.57.2` |
| [@rollup/rollup-darwin-arm64](https://github.com/rollup/rollup) | `4.59.1` | `4.60.0` |
| [@rollup/rollup-linux-x64-gnu](https://github.com/rollup/rollup) | `4.59.1` | `4.60.0` |


Updates `@convex-dev/auth` from 0.0.90 to 0.0.91
- [Changelog](https://github.com/get-convex/convex-auth/blob/main/CHANGELOG.md)
- [Commits](https://github.com/get-convex/convex-auth/compare/v0.0.90...v0.0.91)

Updates `lucide-react` from 1.0.0 to 1.0.1
- [Release notes](https://github.com/lucide-icons/lucide/releases)
- [Commits](https://github.com/lucide-icons/lucide/commits/1.0.1/packages/lucide-react)

Updates `react-router-dom` from 7.13.1 to 7.13.2
- [Release notes](https://github.com/remix-run/react-router/releases)
- [Changelog](https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/CHANGELOG.md)
- [Commits](https://github.com/remix-run/react-router/commits/react-router-dom@7.13.2/packages/react-router-dom)

Updates `eslint-plugin-react-refresh` from 0.4.26 to 0.5.2
- [Release notes](https://github.com/ArnaudBarre/eslint-plugin-react-refresh/releases)
- [Changelog](https://github.com/ArnaudBarre/eslint-plugin-react-refresh/blob/main/CHANGELOG.md)
- [Commits](https://github.com/ArnaudBarre/eslint-plugin-react-refresh/compare/v0.4.26...v0.5.2)

Updates `typescript-eslint` from 8.57.1 to 8.57.2
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/typescript-eslint/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.57.2/packages/typescript-eslint)

Updates `@rollup/rollup-darwin-arm64` from 4.59.1 to 4.60.0
- [Release notes](https://github.com/rollup/rollup/releases)
- [Changelog](https://github.com/rollup/rollup/blob/master/CHANGELOG.md)
- [Commits](https://github.com/rollup/rollup/compare/v4.59.1...v4.60.0)

Updates `@rollup/rollup-linux-x64-gnu` from 4.59.1 to 4.60.0
- [Release notes](https://github.com/rollup/rollup/releases)
- [Changelog](https://github.com/rollup/rollup/blob/master/CHANGELOG.md)
- [Commits](https://github.com/rollup/rollup/compare/v4.59.1...v4.60.0)

---
updated-dependencies:
- dependency-name: "@convex-dev/auth"
  dependency-version: 0.0.91
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: lucide-react
  dependency-version: 1.0.1
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: react-router-dom
  dependency-version: 7.13.2
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: eslint-plugin-react-refresh
  dependency-version: 0.5.2
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: minor-patch
- dependency-name: typescript-eslint
  dependency-version: 8.57.2
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: minor-patch
- dependency-name: "@rollup/rollup-darwin-arm64"
  dependency-version: 4.60.0
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: minor-patch
- dependency-name: "@rollup/rollup-linux-x64-gnu"
  dependency-version: 4.60.0
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: minor-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
- Resolve merge conflicts
- Add dependency review and Dependabot config
- Merge pull request #17 from antonio59/claude/frosty-sanderson

feat: reading streaks, stickers, and share buttons
- Merge pull request #16 from antonio59/claude/frosty-sanderson

chore: cleanup mutation for legacy Convex tables
- Merge pull request #15 from antonio59/claude/frosty-sanderson

Fix blurry covers: upgrade Google Books zoom, lazy loading
- Merge pull request #14 from antonio59/claude/frosty-sanderson

Teen animations: Now Reading, hero word-stagger, cursor trail, confetti
- Add teen animations: Now Reading widget, hero stagger, confetti on book add
- Merge pull request #13 from antonio59/claude/frosty-sanderson

Consistent page layout + breadcrumb navigation
- Merge pull request #12 from antonio59/claude/frosty-sanderson

Add vitest and test script to fix CI
- Merge pull request #11 from antonio59/claude/frosty-sanderson

Fix cover images, codebase review improvements
- Remove unused getCoverUrl import (lint fix)
- Store all covers in Convex via Open Library (skip Google Books placeholders)
- Skip Google Books entirely, use Open Library by title (reliable 404s)
- Detect Google Books placeholder (575x750) in onLoad and trigger fallback
- Try Open Library fallback before Google Books (GB returns 200 OK with placeholder 'image not available' image)
- Force Netlify rebuild
- Clean React state fallback (no DOM hacks, no lazy loading)
- Remove loading=lazy from CoverImage to fix error handler reliability
- DOM-based fallback chain, no React state dependencies
- Simplified blank detection (naturalWidth < 100), removed canvas CORS issue
- Fix cover images: canvas pixel sampling to detect blank/tiny Google Books responses
- Fix CodeQL: proper URL hostname validation instead of substring includes
- Remove unused getBookGradient from PublicWishlist (lint fix)
- Fix remaining direct <img> tags: PublicHome, MyBooks, PublicWishlist now all use CoverImage
- Fix unused useEffect import
- Fix cover images: detect blank Google Books zoom=2 responses via onLoad naturalWidth check
- Fix cover images (inline gradients), standardize page headers/breadcrumbs
- Fix PublicBooks skeleton loading structure
- Complete audit fixes: loading skeletons, debounced search, genre checkmarks, read more hint, 404 animation, updated README
- Audit fixes: duplicate imports, missing getCoverUrl, useLocation in PublicLayout, flip card perspective, keyboard accessibility, gallery reactions mobile, stats grid mobile, unused imports
- Roll out CoverImage (title-card fallback) to all pages
- Show title on gradient instead of placeholder icon when no cover
- Move 5-Star Shelf above Books section
- Cover fallback: zoom=2 primary, zoom=1 fallback, CoverImage component, fix unused Palette import
- Sticky header shadow + footer page links
- Standardize page headers: Back link + pill badge + left-aligned title on all pages
- Sharpen cover images: zoom=2 for Google Books thumbnails + CSS rendering
- Mobile shows review directly instead of flip card
- Fix reactions.ts: simplify title lookup to avoid union type error
- Add emoji reactions: schema, backend, ReactionBar component, public pages, dashboard stats
- Regenerate Convex types with all modules
- Keep convex/_generated in git, remove codegen from Netlify build
- Fix lint: eslint-disable in googleBooks.ts
- Netlify build: add npx convex codegen to generate _generated types
- Use convex.action not convex.query for googleBooks search
- Stop tracking convex/_generated — it's stale and blocks deploy
- Rewrite googleBooks.ts — clean up to match covers.ts pattern, no eslint-disable
- Google Books: change query to action (actions can use fetch in Convex)
- Fix lint: eslint-disable in googleBooks.ts
- Google Books: proxy through Convex to keep API key server-side
- Trigger rebuild for Google Books API key
- Google Books: add optional API key support via VITE_GOOGLE_BOOKS_API_KEY env var
- Edit modal: Google Books search fills only missing metadata, keeps Elise's rating/review/mood
- Edit Book modal: add Google Books search + CoverUpload instead of raw URL input
- Fix lint: eslint-disable for internal api cast in bookSuggestions.ts
- Resend email notification on book suggestion + Elise intro email draft
- Avatar character creator: 13 DiceBear styles, shuffle, live preview, save to Convex
- Giphy/emoji in reviews popup + writing editor, remove name/username from Settings, footer customisation, notifications note
- Remove Edit profile button from public /about page — editing only on /dashboard/about
- Fix header layout: separate Back link from title block on Books, Reviews, Writing pages
- Full feature set: genre filter + grid/list on Books, editorial review cards + rating filter, category filter on Writing, footer with logo, dashboard hero editor
- Comprehensive polish: tighter hero, warmer placeholders, toned CTA, fixed page padding, better empty states
- Pill labels + gradient headings on all pages, fix Wishlist button, energetic About empty state
- Youthful rebrand: Fredoka headings, teal/navy accents, nav icons, active indicators, manga sparkles CSS
- Public About: read-only with Edit link to /dashboard/about. Dashboard: add DiceBear avatar generator
- Add SVG favicon (book on terracotta) + theme-color meta
- Major design polish: hide Sign in, warm logo, restructured homepage flow, side-by-side Writing/Art teasers
- Design polish: 5-star placeholders, book hover effects, deduplicate Currently Reading from grid
- Design polish: smaller hero, uniform CTA buttons, decorative section underlines
- Fix seed script: pass JSON as CLI argument instead of stdin
- Add --prod flag to seed script
- Update seed script to use seed:seedBooks
- Move seedBooks to its own file convex/seed.ts — fix silent deploy skip
- Remove duplicate functions from books.ts (kept in covers.ts)
- Fix covers.ts self-referencing via api.covers.*
- Split cover actions into convex/covers.ts — fix silent deploy failure
- Permanent cover storage: download Google Books covers into Convex, use storageId instead of expiring URLs
- Add seed script + combined all-books.json (26 books)
- Fix CI: remove unused useAuth import, add node types for process.env
- Move email allowlist to Convex env var (ALLOWED_EMAILS)
- Dashboard greeting hardcoded to Hey Elise
- Reorder homepage: 5-Star → Books (with Currently Reading) → Reviews → Writing → Art → Wishlist
- Seed data for 21 more books from Elise's shelf
- Dashboard About page with rich sections: fav book, rereads, quote, fun fact
- Add seedBooks function for bulk book import
- Clean route split: /books /reviews /art /writing for public, /dashboard/* for owner
- Public pages for Books, Reviews, Writings with See All links
- Review editing on Reviews page, update README to npm, verify routes
- Fix GitHub Actions: add permissions block, switch to npm
- Add Wishlist section to public site — books people can gift
- Fix book covers on MyBooks page, show genre on cards
- Smarter genre detection from descriptions, clear form on close
- Smart add: search → preview card → pick shelf. Manual only if not found
- Auto-genre from Google Books, cover upload for manual entry
- Fix GiphyPicker to work without generated types, fix build
- Wire GiphyPicker into review textarea, fix lint errors
- Giphy proxy through Convex — no API key in client
- Fix lint, cover URLs on dashboard, add edit button, start emoji/giphy wiring
- Review popup after adding book, genre fix, lint fix
- Signup lockout: email allowlist, admin role, auth-aware getMyBooks
- Currently Reading widget with progress bars
- Book cards: animations, mood tags display, rating labels on homepage + reviews
- Custom rating labels, mood tags in edit form
- Theme system: 7 themes, ThemeProvider, mood tags in schema
- Book Reviews page with flip cards, filters, stats + Reviews preview on homepage
- Fix book cover URLs: decode HTML entities (&amp; → &) in Google Books links
- Fix homepage: add Writing hero button, reviews on book cards, always show Art section
- Books display, About page loads, art gallery shows all artworks
- Dashboard welcome: animated cycling verbs (reading/drawing/writing/exploring)
- Google Books search, Giphy picker, locked sidebar

- Google Books API: search and auto-fill book details (title, author, cover, pages)
- Giphy picker: emoji grid + GIF search for reviews and writings
- Sidebar: locked with h-screen sticky, independent scroll
- Both components ready to integrate into forms
- Add About page: profile, avatar upload, bio, genres, currently reading
- Add Writing link, tone down Sign In, add Currently Reading + bio
- Mature aesthetic: editorial palette, Playfair Display, updated copy and layout
- Clean up: remove postinstall, deploy:staging, scripts dir

Let npm handle optionalDependencies naturally without workarounds.
- Fix postinstall: install each platform package individually with verification

Instead of one big npm install that triggers re-resolve, install
each missing package individually and verify it landed in node_modules.
- Fix platform deps: postinstall script to force-install missing packages

npm's optionalDependencies bug (cli#4828) causes platform packages
like @rollup/rollup-darwin-arm64 to not install. The postinstall
script checks what's missing and installs it directly with
--ignore-scripts to prevent recursion.
- Fix npm deps: force=true to bypass EBADPLATFORM for optional deps

npm bug (cli#4828) causes optional platform deps to not install on
Mac. force=true tells npm to install all packages regardless of
platform — unused binaries are small and harmless.
- Fix deps: darwin packages in dependencies, linux in optionalDependencies

Darwin packages (needed on Mac) go in dependencies so npm always
installs them. Linux packages go in optionalDependencies so npm
skips them on Mac without EBADPLATFORM errors.
- Fix npm optional deps bug: move platform packages to regular dependencies

npm has a known bug with optionalDependencies where platform-specific
packages don't install correctly (npm/cli#4828). Moving them to regular
dependencies ensures they always install. Added .npmrc with
legacy-peer-deps=true.
- Fix lint: remove isAuthenticated from debug log (React Compiler dep mismatch)
- Add auth debug logging to trace sign-in flow
- Full mobile polish: hamburger nav, responsive text, overflow fix, safe area

- Public header: hamburger menu for mobile nav (books, wishlist, gallery, sign in)
- Hero text: scaled from text-3xl to lg:text-7xl
- Stats: scaled from text-2xl to md:text-4xl
- Section headings: responsive scaling
- Dashboard: responsive text sizing
- html/body: overflow-x hidden prevents horizontal scroll
- viewport-fit=cover for notch devices
- Fix mobile: add overflow-x: hidden to html/body, prevent horizontal scroll
- Fix auth.config.ts: revert to providers: [] (Password configured in auth.ts)
- Fix auth.config.ts: configure Password provider (was OAuth), remove debug logging
- Fix auth: add Password provider to auth.config.ts
- Fix auth: add Password provider to auth.config.ts
- Always show Writings section on public home (with empty state)
- Darwin-arm64 packages in optionalDependencies (with correct esbuild version)
- Fix darwin-arm64 packages: back to devDependencies, match esbuild version
- Regenerate lockfile with @auth/core@0.37.2
- Fix netlify.toml: remove duplicate [build] section
- Move darwin-arm64 packages to optionalDependencies for Netlify compatibility
- Fix Netlify build: use npm install --force (bun not available)
- Remove codegen from CI — types already committed
- Fix codegen command (remove invalid --once flag)
- Merge branch 'upgrade/dependencies'
- Upgrade to Vite 8, ESLint 10, and latest deps
- Upgrade to Vite 8, ESLint 10, and latest deps
- Revert @auth/core to 0.37.2 (0.41 breaks @convex-dev/auth peer dep)
- Remove package.json overrides (conflicts with npm)
- Re-add codegen to CI now that deploy key is set
- Remove codegen from CI — types already committed
- Bump @auth/core from 0.37.2 to 0.41.1 (#3)

Bumps [@auth/core](https://github.com/nextauthjs/next-auth) from 0.37.2 to 0.41.1.
- [Release notes](https://github.com/nextauthjs/next-auth/releases)
- [Commits](https://github.com/nextauthjs/next-auth/compare/@auth/core@0.37.2...@auth/core@0.41.1)

---
updated-dependencies:
- dependency-name: "@auth/core"
  dependency-version: 0.41.1
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- Bump lucide-react from 0.562.0 to 0.577.0 (#5)

Bumps [lucide-react](https://github.com/lucide-icons/lucide/tree/HEAD/packages/lucide-react) from 0.562.0 to 0.577.0.
- [Release notes](https://github.com/lucide-icons/lucide/releases)
- [Commits](https://github.com/lucide-icons/lucide/commits/0.577.0/packages/lucide-react)

---
updated-dependencies:
- dependency-name: lucide-react
  dependency-version: 0.577.0
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- Fix lint: remove unused imports
- Fix CI: generate Convex types before lint
- Regenerate Convex types for writings module
- Remove --frozen-lockfile from CI (lockfile regenerates on Mac)
- Simplify CI: remove production branch refs, add Dependabot

- CI runs on main only
- Convex deploy runs on main only
- Added Dependabot for weekly dependency checks
- Revert auth.config.ts — empty providers is correct for @convex-dev/auth CLI

The Password provider is configured in auth.ts (server-side).
auth.config.ts with empty providers is the expected format.
- Single production environment
- Add Writing feature + manga design + auth fix

📝 WRITING FEATURE:
- New convex/writings.ts backend with full CRUD
- New src/pages/MyWritings.tsx page for poetry, stories, journal
- Schema updated with writings table (type, genre, tags, wordCount, isPublished)
- Dashboard shows writing stats (total pieces, word count)
- PublicHome shows published writings
- Navigation includes 'My Writing' with PenTool icon

🔐 AUTH FIX:
- convex/auth.config.ts now exports Password provider

🎨 MANGA DESIGN:
- Added halftone dots, speed lines, speech bubbles
- Manga panel frames with gradient borders
- Sparkle accents, action lines
- Writing editor with lined paper background
- Genre tags with manga styling
- Chibi mascot corner element

ROUTING:
- /writing route added to App.tsx
- Layout.tsx nav includes My Writing
- Quick action card on Dashboard

TODO: Run 'bunx convex dev' to regenerate types
- Add frictionless book search to suggestions and refresh color scheme

- Add Open Library API integration for book search in suggestion form
- Auto-populate title, author, cover, and genre when selecting a book
- Simplified form for kids (removed email field)
- Replace purple gradients with sakura pink to teal (#ec4899 → #06b6d4)
- Update color scheme across all components for unique kawaii aesthetic
- Add robots.txt to block admin routes from crawlers
- Fix TypeScript lint error for book ID type
- Add book/art editing, reading goals, suggestions, wishlist, and mobile responsiveness

- Add edit modals for books and artwork with full field editing
- Add reading goals feature with progress tracking on dashboard
- Add book suggestions system with duplicate detection for visitors
- Add public wishlist page at /wishlist
- Add settings page for profile and preferences
- Add admin suggestions management page
- Implement smart duplicate detection when adding books (offers to move instead of block)
- Add mobile responsive hamburger menu and slide-out sidebar
- Add ErrorBoundary for graceful error handling
- Clean up auth debug logging
- Fix gitignore and simplify auth config
- Ignore .netlify folder
- Remove invalid plugin config
- Disable Next.js plugin - this is a Vite app
- Add siteSettings:get for backward compatibility
- Trigger rebuild
- Fix PublicGallery type error for artwork ID
- Add convex.json config, remove migrations
- Add migration functions to cleanup legacy user fields
- Add error handling to getCurrentUser query
- Disable schema validation for legacy data compatibility

Old users table has createdAt, passwordHash, role fields that conflict
with Convex Auth schema. Disabling validation allows deploy to succeed.
- Fix schema to support legacy data fields

- Add pagesTotal and published as optional fields for existing books
- Use v.any() for userId fields to support old ID formats
- Maintains backward compatibility with existing Convex data
- Make books and artworks site-wide (single-user site)

- Remove userId filtering on read queries for books/artworks
- All authenticated users (Elise + parents) can view and manage all content
- Stats now show site-wide totals, not per-user
- Mutations still require auth but don't restrict by userId
- Add data migration for claiming orphaned books/artworks

After switching to Convex Auth, existing data has old userIds.
Run migrations:claimOrphanedData from Convex dashboard to claim all data.
- Update @types/node to v25
- Fix lint errors

- Ignore convex/_generated in eslint config
- Refactor AuthContext to use useMemo/useCallback instead of setState in useEffect
- Remove unused imports (Star, Edit, Id, updateBook)
- Add GitHub Actions CI/CD and project README

- CI workflow: lint, type check, build on push/PR
- Convex deploy workflow: auto-deploy schema on convex/ changes
- README with project overview, setup, and deployment docs
- Migrate from Next.js to Vite + React 19 + Convex Auth

### Chores

- Remove guestbook feature
- **deps**: Bump the minor-patch group with 18 updates (#28)
- Remove old Claude worktrees after branch cleanup
- Add git-cliff config for changelog generation
- Add git-cliff config for changelog generation
- Add git-cliff config for changelog generation
- Add reminder to lift typescript 6.x ignore when typescript-eslint supports it
- Ignore typescript 6.x bumps (blocked by typescript-eslint peer dep)
- Ignore @auth/core bumps past 0.37.x (blocked by @convex-dev/auth peer dep)
- Add purgeUnusedTables cleanup mutation for legacy tables
- Final production config
- Remove .npmrc from repo, add to gitignore
- Add linux optional deps for netlify build
- Move darwin packages to optionalDependencies only, regenerate lockfile
- Update netlify build command to omit optional deps
- Pin @auth/core to 0.37.4 for convex-dev/auth compatibility
- Regenerate package-lock.json on mac with optional only
- Switch from bun to npm
- Enable optional deps in bun
- Remove package-lock.json, using bun
- Regenerate lockfile for linux compatibility

### Documentation

- Add DESIGN.md following google-labs-code/design.md spec
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]

### Features

- Creative features + UI/UX improvements for Elise
- Weekly summary email, global search, theme toggle, OG meta, and security hardening
- Bring elise up to izzy-reads coding and design standards
- Bring elise up to izzy-reads coding and design standards
- Mark-as-bought on wishlist, share wishlist link, cover art fix
- Discover page with Tinder-style book swipe recommendations (#25)
- Reading streaks, stickers, and share buttons
- Consistent page layout with breadcrumb navigation across all public pages
- Permanent cover storage with auto-refresh for expired Google Books URLs (#10)
- Permanent cover storage with auto-refresh for expired Google Books URLs

### Refactoring

- Address all highlighted frontend and backend issues

### Security

- Override uuid to ^14.0.0 to fix CVE-2025-4848 / GHSA-w5hq-g745-h8pq
- Harden rate limits, fix Resend domain, add HSTS, filter artworks by user (#30)

### Testing

- Add vitest + cover utility tests, add test script to package.json


