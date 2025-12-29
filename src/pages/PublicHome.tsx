import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Palette, Sparkles, Heart, Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const PublicHome: React.FC = () => {
  const books = useQuery(api.books.getReadBooks) ?? [];
  const artworks = useQuery(api.artworks.getPublished, { limit: 6 }) ?? [];

  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + (b.pageCount || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-slate-600">
                Welcome to my world!
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-primary-500 via-violet-500 to-accent-500 bg-clip-text text-transparent">
                Elise's Reading
              </span>
              <br />
              <span className="text-slate-800">Adventures</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Books I love, art I create, and adventures I go on through the
              pages of amazing stories!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/gallery" className="btn btn-gradient">
                <Palette className="w-5 h-5" />
                View My Art
              </Link>
              <a href="#books" className="btn btn-secondary">
                <BookOpen className="w-5 h-5" />
                See My Books
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                {totalBooks}
              </div>
              <div className="text-sm text-slate-500 mt-1">Books Read</div>
            </motion.div>

            <motion.div
              className="stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-violet-500 to-accent-500 bg-clip-text text-transparent">
                {totalPages.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 mt-1">Pages Read</div>
            </motion.div>

            <motion.div
              className="stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">
                {artworks.length}
              </div>
              <div className="text-sm text-slate-500 mt-1">Artworks</div>
            </motion.div>

            <motion.div
              className="stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                {books.filter((b) => b.rating && b.rating >= 4).length}
              </div>
              <div className="text-sm text-slate-500 mt-1">Favorites</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Books Section */}
      <section id="books" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Recent Reads</h2>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No books yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {books.slice(0, 6).map((book, index) => (
                <motion.div
                  key={book._id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 shadow-md group-hover:shadow-xl transition-all group-hover:scale-105">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-violet-100">
                        <BookOpen className="w-8 h-8 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {book.author}
                  </p>
                  {book.rating && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < book.rating!
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Art Gallery Preview */}
      {artworks.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-800">My Art</h2>
              <Link
                to="/gallery"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View gallery
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {artworks.slice(0, 6).map((art, index) => (
                <motion.div
                  key={art._id}
                  className="group relative aspect-square rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold">{art.title}</h3>
                      {art.likes && art.likes > 0 && (
                        <div className="flex items-center gap-1 text-white/80 text-sm">
                          <Heart className="w-3 h-3" />
                          {art.likes}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PublicHome;
