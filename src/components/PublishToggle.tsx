import React from "react";

interface PublishToggleProps {
  published: boolean;
  onChange: (published: boolean) => void;
  label?: string;
  description?: string;
}

const PublishToggle: React.FC<PublishToggleProps> = ({
  published,
  onChange,
  label = "Publish immediately",
  description = "Make this visible in your public gallery",
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div>
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!published)}
        className={`w-12 h-7 rounded-full transition-colors ${
          published ? "bg-success-500" : "bg-slate-300"
        }`}
        aria-pressed={published}
      >
        <div
          className={`w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${
            published ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default PublishToggle;
