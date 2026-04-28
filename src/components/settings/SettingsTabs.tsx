import React from "react";

interface SettingsTabsProps {
  children: React.ReactNode;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ children }) => {
  return <div className="space-y-6">{children}</div>;
};

export default SettingsTabs;
