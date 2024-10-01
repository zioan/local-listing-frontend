import React, { createContext, useState, useContext } from "react";

// Create a context for search functionality
const SearchContext = createContext();

/**
 * Custom hook to use the SearchContext.
 *
 * @returns {Object} The search context value
 */
export const useSearch = () => useContext(SearchContext);

/**
 * SearchProvider component that wraps the application and provides
 * search functionality context to its children.
 *
 * @param {Object} props - React props
 * @param {ReactNode} props.children - Children components to be wrapped
 * @returns {JSX.Element} The SearchProvider component
 */
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  /**
   * Update the search term state with a new term.
   *
   * @param {string} term - The new search term to set
   */
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return <SearchContext.Provider value={{ searchTerm, handleSearch }}>{children}</SearchContext.Provider>;
};
