import { motion } from "framer-motion";
import { Book } from "@/lib/store";
import { Rating } from "@/components/ui/Rating";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-none webtoon-shadow bg-white webtoon-card-hover flex flex-col rounded-[20px]">
        <div className="relative aspect-[2/3] overflow-hidden bg-purple-50 group">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-sm font-medium">Read on {book.dateRead}</p>
          </div>
        </div>
        <CardContent className="p-5 flex-grow">
          <h3 className="font-display text-xl font-bold text-foreground mb-1 line-clamp-1" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 font-medium">{book.author}</p>
          <Rating value={book.rating} className="mb-4" />
          <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
            "{book.review}"
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <div className="w-full h-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
