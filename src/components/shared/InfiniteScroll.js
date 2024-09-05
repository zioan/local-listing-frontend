import React, { useEffect, useRef, useCallback } from "react";
import LoadingSpinner from "./LoadingSpinner";

const InfiniteScroll = ({ children, loadMore, hasMore, loading }) => {
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      {children}
      <div ref={lastElementRef} />
      {loading && <LoadingSpinner isLoading={loading} />}
    </div>
  );
};

export default InfiniteScroll;
