import React, { createContext, useContext, useState, useCallback } from "react";

const WatcherContext = createContext();

export const useWatcher = () => {
  const context = useContext(WatcherContext);
  if (!context) {
    throw new Error("useWatcher must be used within a WatcherProvider");
  }
  return context;
};

export const WatcherProvider = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState({});

  const triggerUpdate = useCallback((type) => {
    setUpdateTrigger((prev) => ({ ...prev, [type]: Date.now() }));
  }, []);

  return <WatcherContext.Provider value={{ updateTrigger, triggerUpdate }}>{children}</WatcherContext.Provider>;
};
