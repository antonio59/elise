import React from "react";
import { Link } from "react-router-dom";
import { Feather, Palette, Camera } from "lucide-react";

const FeaturedArt: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Feather className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Writing</h3>
          <p className="text-sm text-slate-500 italic">
            stories dropping soon... ✍️
          </p>
          <Link
            to="/writing"
            className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            See all →
          </Link>
        </div>
        <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Art</h3>
          <p className="text-sm text-slate-500 italic">
            doodles incoming... 🎨
          </p>
          <Link
            to="/art"
            className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            See all →
          </Link>
        </div>
        <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Photos</h3>
          <p className="text-sm text-slate-500 italic">
            moments captured... 📸
          </p>
          <Link
            to="/photos"
            className="inline-block mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            See all →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArt;
