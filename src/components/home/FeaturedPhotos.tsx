import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeader from "../SectionHeader";

const FeaturedPhotos: React.FC<{
  photos: Array<{
    _id: string;
    imageUrl: string;
    title: string;
  }>;
}> = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Photos"
          action={{ label: "See all", to: "/photos" }}
          className="mb-8"
        />
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to="/photos">
                <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPhotos;
