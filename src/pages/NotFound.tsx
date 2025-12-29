import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-9xl font-black bg-gradient-to-r from-primary-500 via-violet-500 to-accent-500 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-8 max-w-md">
          Oops! Looks like this page wandered off into another story. Let's get
          you back on track!
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            <BookOpen className="w-5 h-5" />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
