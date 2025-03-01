import React, { createContext, useState, ReactNode } from 'react';

interface AuraCountContextProps {
  auraCount: number;
  setAuraCount: React.Dispatch<React.SetStateAction<number>>;
}

export const AuraCountContext = createContext<AuraCountContextProps | undefined>(undefined);

export const AuraCountProvider = ({ children }: { children: ReactNode }) => {
  const [auraCount, setAuraCount] = useState(100);

  return (
    <AuraCountContext.Provider value={{ auraCount, setAuraCount }}>
      {children}
    </AuraCountContext.Provider>
  );
};