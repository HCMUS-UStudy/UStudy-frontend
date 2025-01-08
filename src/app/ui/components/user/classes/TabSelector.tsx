import { useEffect, useRef, useState, useMemo } from "react";

interface TabSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabSelector({
  activeTab,
  setActiveTab,
}: TabSelectorProps) {
  const tabs = useMemo(
    () => [
      { id: "ongoing", label: "Lớp đang dạy" },
      { id: "completed", label: "Lớp đã hoàn thành" },
    ],
    [],
  );

  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetWidth, offsetLeft } = activeTabElement;
      setSliderStyle({ width: offsetWidth, left: offsetLeft });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative">
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current[index] = el; // Lưu ref
            }}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-2 py-2 transition-colors duration-300 text-lg
              ${activeTab === tab.id ? "text-sky-600" : "text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Slider */}
      <div
        className="absolute bottom-0 h-1 bg-sky-600 transition-all duration-300"
        style={{
          width: `${sliderStyle.width}px`,
          left: `${sliderStyle.left}px`,
        }}
      />
    </div>
  );
}
