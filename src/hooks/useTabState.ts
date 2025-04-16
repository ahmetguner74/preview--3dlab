
import { useState } from 'react';

export const useTabState = (defaultTab: string) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return {
    activeTab,
    handleTabChange
  };
};
