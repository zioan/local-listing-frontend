import React, { useEffect } from "react";
import { useData } from "../context/DataContext";

/**
 * AppInitializer component initializes data when the app starts.
 *
 * @param {React.PropsWithChildren} props - The component's props.
 * @returns {JSX.Element} The AppInitializer component.
 */
function AppInitializer({ children }) {
  const { initializeData } = useData();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return <>{children}</>;
}

export default AppInitializer;
