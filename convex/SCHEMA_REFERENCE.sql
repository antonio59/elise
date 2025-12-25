-- ============================================
-- ELISE DATABASE SCHEMA REFERENCE
-- ============================================
-- This is a SQL-like reference for the Convex schema.
-- Convex uses a document database, but this helps visualize
-- the data structure in familiar terms.
--
-- Actual schema is defined in: convex/schema.ts
-- ============================================

-- Users table (authentication and profiles)
CREATE TABLE users (
    _id TEXT PRIMARY KEY,           -- Convex auto-generated ID
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('child', 'parent')),
    username TEXT,
    avatarUrl TEXT,
    bio TEXT,
    createdAt BIGINT NOT NULL,      -- Unix timestamp in ms
    
    INDEX by_email (email),
    INDEX by_role (role)
);

-- Sessions table (auth tokens)
CREATE TABLE sessions (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(_id),
    token TEXT NOT NULL UNIQUE,
    expiresAt BIGINT NOT NULL,      -- Unix timestamp in ms
    
    INDEX by_token (token),
    INDEX by_user (userId)
);

-- Books table
CREATE TABLE books (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(_id),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    coverUrl TEXT,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5),
    status TEXT NOT NULL CHECK (status IN ('reading', 'read', 'wishlist')),
    genre TEXT,
    pagesTotal INTEGER,
    pagesRead INTEGER,
    isFavorite BOOLEAN NOT NULL DEFAULT FALSE,
    finishedAt BIGINT,              -- Unix timestamp in ms
    createdAt BIGINT NOT NULL,
    
    INDEX by_user (userId),
    INDEX by_user_status (userId, status),
    INDEX by_user_favorite (userId, isFavorite)
);

-- Art Series table (for grouping artworks)
CREATE TABLE artSeries (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(_id),
    title TEXT NOT NULL,
    description TEXT,
    coverUrl TEXT,
    createdAt BIGINT NOT NULL,
    
    INDEX by_user (userId)
);

-- Artworks table
CREATE TABLE artworks (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(_id),
    title TEXT,
    style TEXT,
    imageUrl TEXT NOT NULL,
    storageId TEXT,                 -- Convex storage ID
    published BOOLEAN NOT NULL DEFAULT TRUE,
    seriesId TEXT REFERENCES artSeries(_id),
    seriesOrder INTEGER,
    createdAt BIGINT NOT NULL,
    
    INDEX by_user (userId),
    INDEX by_published (published),
    INDEX by_series (seriesId)
);

-- Reviews table
CREATE TABLE reviews (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(_id),
    bookTitle TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
    moodColor TEXT NOT NULL,        -- inkPink, inkLime, inkCyan, inkPurple, inkYellow
    content TEXT NOT NULL,
    imageUrl TEXT,
    storageId TEXT,                 -- Convex storage ID
    published BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt BIGINT NOT NULL,
    
    INDEX by_user (userId),
    INDEX by_published (published),
    INDEX by_book (bookTitle)
);

-- Likes table
CREATE TABLE likes (
    _id TEXT PRIMARY KEY,
    userId TEXT REFERENCES users(_id),  -- Optional for anonymous likes
    contentId TEXT NOT NULL,            -- ID of artwork or review
    contentType TEXT NOT NULL CHECK (contentType IN ('artwork', 'review')),
    createdAt BIGINT NOT NULL,
    
    INDEX by_content (contentId),
    INDEX by_user_content (userId, contentId)
);

-- Follows table
CREATE TABLE follows (
    _id TEXT PRIMARY KEY,
    followerId TEXT NOT NULL REFERENCES users(_id),
    followingId TEXT NOT NULL REFERENCES users(_id),
    createdAt BIGINT NOT NULL,
    
    INDEX by_follower (followerId),
    INDEX by_following (followingId),
    INDEX by_pair (followerId, followingId),
    
    UNIQUE (followerId, followingId)
);

-- Reading Streaks table (for tracking daily reading activity)
CREATE TABLE readingStreaks (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES users(_id),
    date TEXT NOT NULL,             -- YYYY-MM-DD format
    pagesRead INTEGER NOT NULL DEFAULT 0,
    booksFinished INTEGER NOT NULL DEFAULT 0,
    
    INDEX by_user (userId),
    INDEX by_user_date (userId, date),
    
    UNIQUE (userId, date)
);

-- ============================================
-- NOTES:
-- ============================================
-- 
-- 1. All tables have automatic _id and _creationTime fields from Convex
-- 
-- 2. Timestamps are stored as BIGINT (Unix milliseconds) for Convex compatibility
-- 
-- 3. File uploads use Convex's built-in storage:
--    - storageId references _storage table
--    - Use ctx.storage.generateUploadUrl() for uploads
--    - Use ctx.storage.getUrl(storageId) to get public URLs
--
-- 4. Authentication flow:
--    - Register creates user + session
--    - Login validates password and creates session
--    - Sessions expire after 30 days
--    - Token stored in localStorage on client
--
-- 5. Authorization:
--    - Users can only modify their own content
--    - Parents (role='parent') can modify any content
--    - Published content is publicly viewable
--
-- ============================================
