import React from "react";
import { Link } from "react-router-dom";
import { Palette } from "lucide-react";
import { ArtGridSkeleton } from "../Skeleton";

interface RecentArtworksProps {
  artworks:
    | { _id: string; title: string; imageUrl: string }[]
    | undefined;
  recentArtworks: { _id: string; title: string; imageUrl: string }[];
}

const RecentArtworks: React.FC<RecentArtworksProps> = ({
  artworks,
  recentArtworks,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Recent Art</h2>
        <Link
          to="/dashboard/art"
          className="text-accent-600 hover:text-accent-700 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      {artworks === undefined ? (
        <ArtGridSkeleton />
      ) : recentArtworks.length === 0 ? (
        <div className="card p-8 text-center">
          <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">
            No artworks yet. Show off your creations!
          </p>
          <Link to="/dashboard/art" className="btn btn-gradient">
            Upload Your First Art
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentArtworks.map(
            (art: { _id: string; title: string; imageUrl: string }) => (
              <div key={art._id} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                  {art.title}
                </h3>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default RecentArtworks;
