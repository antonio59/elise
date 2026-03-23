import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  /** Small uppercase pill above the title */
  badge: string;
  /** Title text (rendered with gradient) */
  title: string;
  /** One-line subtitle below the title */
  subtitle: string;
  /** Breadcrumb path. Always starts with Home (/). */
  breadcrumbs: Crumb[];
  /** Optional content to render to the right of the text (e.g. action buttons) */
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-400 mb-5">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-primary-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            {crumb.to ? (
              <Link
                to={crumb.to}
                className="hover:text-primary-600 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-600 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            {badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
