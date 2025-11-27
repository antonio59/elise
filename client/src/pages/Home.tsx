import { useStore } from "@/lib/store";
import { BookCard } from "@/components/books/BookCard";
import { motion } from "framer-motion";
import animeGirl from '@assets/generated_images/anime_style_girl_reading_magic_book.png';

export default function Home() {
  const books = useStore((state) => state.books);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-50 to-white pt-12 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-bold mb-4 shadow-sm">
                Welcome to my space! ✨
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1]">
                My Reading <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Adventures
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                I'm collecting all the magical worlds I've visited and the stories that made me smile. Take a look around!
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="flex-1 relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                <div className="absolute inset-0 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <img 
                  src={animeGirl} 
                  alt="Anime girl reading" 
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 0 100%)" }}></div>
      </section>

      {/* Books Grid */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            Latest Reads 
            <span className="text-sm font-normal bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {books.length} books
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
