import React from "react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  action?: {
    label: string;
    to: string;
  };
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          {title}
        </h2>
        <div className="w-10 h-0.5 bg-primary-400 mt-1 rounded-full" />
      </div>
      {action && (
        <Link
          to={action.to}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
