import React, { useEffect } from "react";
import { useData } from "../context/DataContext";

function AppInitializer({ children }) {
  const { initializeData } = useData();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return <>{children}</>;
}

export default AppInitializer;
