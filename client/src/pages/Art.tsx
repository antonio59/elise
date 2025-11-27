import { useStore } from "@/lib/store";
import { ArtCard } from "@/components/art/ArtCard";
import { motion } from "framer-motion";

export default function Art() {
  const artworks = useStore((state) => state.artworks);

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="bg-secondary/20 py-20 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-display font-bold mb-4 text-secondary-foreground"
          >
            My Art Gallery 🎨
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto"
          >
            Here are some sketches, doodles, and finished pieces I've been working on!
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      </div>
    </div>
  );
}
