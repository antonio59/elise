import React from "react";
import type { LucideIcon } from "lucide-react";

interface SettingsSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const SettingsSectionHeader: React.FC<SettingsSectionHeaderProps> = ({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default SettingsSectionHeader;
