import React from "react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { ArtGridSkeleton } from "../Skeleton";

interface RecentPhotosProps {
  photos:
    | { _id: string; title: string; imageUrl: string }[]
    | undefined;
  recentPhotos: { _id: string; title: string; imageUrl: string }[];
}

const RecentPhotos: React.FC<RecentPhotosProps> = ({
  photos,
  recentPhotos,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Recent Photos</h2>
        <Link
          to="/dashboard/photos"
          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      {photos === undefined ? (
        <ArtGridSkeleton />
      ) : recentPhotos.length === 0 ? (
        <div className="card p-8 text-center">
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">
            No photos yet. Start capturing moments!
          </p>
          <Link to="/dashboard/photos" className="btn btn-gradient">
            Upload Your First Photo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentPhotos.map(
            (photo: { _id: string; title: string; imageUrl: string }) => (
              <div key={photo._id} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-slate-800 line-clamp-1">
                  {photo.title}
                </h3>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default RecentPhotos;
