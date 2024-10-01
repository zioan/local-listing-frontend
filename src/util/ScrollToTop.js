import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that scrolls the window to the top
 * whenever the current pathname changes.
 * This is useful for ensuring the page is scrolled to the top
 * preventing React single-page application default behavior to keep the scroll position.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency on pathname ensures this runs on route change

  return null; // This component does not render anything
}

export default ScrollToTop;
