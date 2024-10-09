import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

/**
 * Tooltip component for displaying additional information on hover or focus.
 *
 * This component wraps its children and displays a tooltip when the user
 * hovers over or focuses on the wrapped element. The tooltip is rendered
 * using a portal to avoid layout issues.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The element to wrap with the tooltip.
 * @param {string|React.ReactNode} props.content - The content to display in the tooltip.
 * @param {string} [props.position="top"] - The position of the tooltip relative to the wrapped element.
 *                                         Can be "top", "bottom", "left", "right", or "none".
 *                                         Use "none" to conditionally disable the tooltip.
 * @returns {React.ReactElement} The wrapped element with a tooltip.
 *
 * @example
 * // Basic usage
 * <Tooltip content="Helper text" position="top">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * @example
 * // Conditional tooltip based on screen size
 * <Tooltip content="Helper text" position={isMobile ? "top" : "none"}>
 *   <button>Hover me on mobile</button>
 * </Tooltip>
 */
const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const targetRef = useRef(null);

  /**
   * Calculates and sets the position of the tooltip based on the target element's position.
   * This function is called when the tooltip becomes visible and on scroll/resize events.
   */
  const positionTooltip = useCallback(() => {
    if (!targetRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipStyles = {
      position: "fixed",
      zIndex: 9999,
    };

    switch (position) {
      case "top":
        tooltipStyles.left = targetRect.left + targetRect.width / 2;
        tooltipStyles.top = targetRect.top - 8; // 8px above the element
        tooltipStyles.transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        tooltipStyles.left = targetRect.left + targetRect.width / 2;
        tooltipStyles.top = targetRect.bottom + 8; // 8px below the element
        tooltipStyles.transform = "translate(-50%, 0)";
        break;
      case "left":
        tooltipStyles.left = targetRect.left - 8; // 8px to the left of the element
        tooltipStyles.top = targetRect.top + targetRect.height / 2;
        tooltipStyles.transform = "translate(-100%, -50%)";
        break;
      case "right":
        tooltipStyles.left = targetRect.right + 8; // 8px to the right of the element
        tooltipStyles.top = targetRect.top + targetRect.height / 2;
        tooltipStyles.transform = "translate(0, -50%)";
        break;
      default:
        // For "none" or any unrecognized position, don't set any positioning styles
        break;
    }

    setTooltipStyle(tooltipStyles);
  }, [position]);

  // Effect to handle tooltip positioning and event listeners
  useEffect(() => {
    if (isVisible) {
      positionTooltip();
      window.addEventListener("scroll", positionTooltip);
      window.addEventListener("resize", positionTooltip);
    }
    return () => {
      window.removeEventListener("scroll", positionTooltip);
      window.removeEventListener("resize", positionTooltip);
    };
  }, [isVisible, positionTooltip]);

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible &&
        position !== "none" &&
        ReactDOM.createPortal(
          <div className="px-2 py-1 text-sm text-white bg-black rounded whitespace-nowrap" style={tooltipStyle}>
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
