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
  handleTabChange: (tab: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

/**
 * Tabs component
 *
 * @param children - TabList, Tab, TabPanel
 * @param className - Additional classes
 * @param value - Active tab value
 * @param onTabChange - Callback when tab is changed
 *
 * @example
 * ```tsx
 * <Tabs value="tab1" onTabChange={(tab) => console.log(tab)}>
 *   <TabList>
 *     <Tab label="Tab 1" value="tab1" />
 *     <Tab label="Tab 2" value="tab2" />
 *   </TabList>
 *   <TabPanel value="tab1">Tab 1 content</TabPanel>
 *   <TabPanel value="tab2">Tab 2 content</TabPanel>
 * </Tabs>
 * ```
 */
const Tabs: React.FC<TabsProps> = ({
  children,
  className,
  value,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>(value || "");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, handleTabChange }}>
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

/**
 * TabList component
 *
 * Contains a list of tabs
 *
 * @param children - Tab components
 * @param className - Additional classes
 *
 * @example
 * ```tsx
 * <TabList>
 *   <Tab label="Tab 1" value="tab1" />
 *   <Tab label="Tab 2" value="tab2" />
 * </TabList>
 * ```
 */
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

/**
 * Tab component
 *
 * Tab trigger button
 *
 * @param label - Tab label
 * @param value - Tab value
 * @param className - Additional classes
 *
 * @example
 * ```tsx
 * <Tab label="Tab 1" value="tab1" />
 * ```
 */
const Tab: React.FC<TabProps> = ({ label, value, className }) => {
  const { activeTab, handleTabChange } = useTabsContext();

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
      onClick={() => handleTabChange(value)}
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

/**
 * TabPanel component
 *
 * Tab content
 *
 * @param value - Tab value
 * @param children - Tab content
 * @param className - Additional classes
 *
 * @example
 * ```tsx
 * <TabPanel value="tab1">Tab 1 content</TabPanel>
 * ```
 */
const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
  const { activeTab } = useTabsContext();

  return activeTab === value ? (
    <div className={cn("", className)}>{children}</div>
  ) : null;
};

export { Tabs, TabList, Tab, TabPanel };
