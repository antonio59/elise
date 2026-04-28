import React from "react";
import type { LucideIcon } from "lucide-react";

interface CardHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  actionLabel: string;
  actionIcon: LucideIcon;
  cancelLabel: string;
  cancelIcon: LucideIcon;
  showForm: boolean;
  onToggle: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  actionLabel,
  actionIcon: ActionIcon,
  cancelLabel,
  cancelIcon: CancelIcon,
  showForm,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button onClick={onToggle} className="btn btn-secondary btn-sm">
        {showForm ? (
          <CancelIcon className="w-4 h-4" />
        ) : (
          <ActionIcon className="w-4 h-4" />
        )}
        {showForm ? cancelLabel : actionLabel}
      </button>
    </div>
  );
};

export default CardHeader;
