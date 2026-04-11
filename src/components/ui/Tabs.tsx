import { useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(clsx(inputs));
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  size = "md",
  className,
}) => {
  const sizeStyles: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-2.5",
  };

  if (variant === "pills") {
    return (
      <div className={cn("inline-flex bg-slate-100 rounded-xl p-1", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative rounded-lg font-medium transition-colors",
              sizeStyles[size],
              activeTab === tab.id
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div className={cn("flex border-b border-slate-200", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative font-medium transition-colors -mb-px",
              sizeStyles[size],
              activeTab === tab.id
                ? "text-primary-600"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-lg font-medium transition-all",
            sizeStyles[size],
            activeTab === tab.id
              ? "bg-primary-100 text-primary-700"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
          )}
        >
          <span className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

interface TabContentProps {
  children: React.ReactNode;
  tabId: string;
  activeTab: string;
  className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  children,
  tabId,
  activeTab,
  className,
}) => {
  if (tabId !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ControlledTabsProps {
  tabs: Array<Tab & { content: React.ReactNode }>;
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  contentClassName?: string;
}

export const ControlledTabs: React.FC<ControlledTabsProps> = ({
  tabs,
  defaultTab,
  variant = "default",
  size = "md",
  className,
  contentClassName,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      <Tabs
        tabs={tabs.map(({ id, label, icon }) => ({ id, label, icon }))}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant={variant}
        size={size}
      />
      <div className={cn("mt-4", contentClassName)}>
        {tabs.map((tab) => (
          <TabContent key={tab.id} tabId={tab.id} activeTab={activeTab}>
            {tab.content}
          </TabContent>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
