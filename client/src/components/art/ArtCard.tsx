import { motion } from "framer-motion";
import { ArtWork } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

interface ArtCardProps {
  art: ArtWork;
}

export function ArtCard({ art }: ArtCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-none webtoon-shadow bg-white rounded-[20px] group cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={art.image}
            alt={art.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg px-4 py-2 border-2 border-white rounded-full">
              View Full
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            {art.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {art.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
