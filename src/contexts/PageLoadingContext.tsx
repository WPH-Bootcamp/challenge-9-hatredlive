/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

type PageLoadingContextType = {
  isReady: boolean;
  setReady: (ready: boolean) => void;
};

const PageLoadingContext = createContext<PageLoadingContextType | undefined>(undefined);

export function usePageLoading() {
  const context = useContext(PageLoadingContext);
  if (!context) {
    throw new Error('usePageLoading must be used within PageLoadingProvider');
  }
  return context;
}

export function PageLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setReady] = useState(true);

  return (
    <PageLoadingContext.Provider value={{ isReady, setReady }}>
      {children}
    </PageLoadingContext.Provider>
  );
}
