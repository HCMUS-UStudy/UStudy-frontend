import React, { useState, createContext, useContext, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface TabsProps {
  children: ReactNode;
  className?: string;
  value: string;
  onTabChange?: (value: string) => void;
}

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

const Tabs: React.FC<TabsProps> = ({
  children,
  className,
  value,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>(value || "");

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a Tabs");
  }
  return context;
};

interface TabListProps {
  children: ReactNode;
  className?: string;
}

const TabList: React.FC<TabListProps> = ({ children, className }) => {
  return (
    <div className={cn("flex space-x-4 border-b mb-6", className)}>
      {children}
    </div>
  );
};

interface TabProps {
  label: string;
  value: string;
  className?: string;
}

const Tab: React.FC<TabProps> = ({ label, value, className }) => {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <button
      className={cn(
        "py-2 px-4 text-lg font-semibold",
        {
          "border-b-2 border-primary text-primary": activeTab === value,
          "text-gray-700": activeTab !== value,
        },
        className,
      )}
      onClick={() => setActiveTab(value)}
    >
      {label}
    </button>
  );
};

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
  const { activeTab } = useTabsContext();

  return activeTab === value ? (
    <div className={cn("", className)}>{children}</div>
  ) : null;
};

export { Tabs, TabList, Tab, TabPanel };
