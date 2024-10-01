import React, { createContext, useContext, useState, useCallback } from "react";

// Create a context for watching updates
const WatcherContext = createContext();

/**
 * Custom hook to use the WatcherContext.
 *
 * @returns {Object} The watcher context value
 * @throws {Error} If used outside of WatcherProvider
 */
export const useWatcher = () => {
  const context = useContext(WatcherContext);
  if (!context) {
    throw new Error("useWatcher must be used within a WatcherProvider");
  }
  return context;
};

/**
 * WatcherProvider component that provides a context for managing
 * update triggers across the application.
 *
 * @param {Object} props - React props
 * @param {ReactNode} props.children - Children components to be wrapped
 * @returns {JSX.Element} The WatcherProvider component
 */
export const WatcherProvider = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState({});

  /**
   * Triggers an update by setting the current timestamp for the given type.
   *
   * @param {string} type - The type of update to trigger
   */
  const triggerUpdate = useCallback((type) => {
    setUpdateTrigger((prev) => ({ ...prev, [type]: Date.now() })); // Update the state with the current timestamp
  }, []);

  return <WatcherContext.Provider value={{ updateTrigger, triggerUpdate }}>{children}</WatcherContext.Provider>;
};
