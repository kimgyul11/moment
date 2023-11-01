import React, { useEffect, useState } from "react";

export default function useIntersectionObserver(
  targetRef,
  { threshold = 0.1, root = null, rootMargin = "0%" }
) {
  const [entry, setEntry] = useState();
  const updateEntry = ([entry]) => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = targetRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;
    if (!node || !hasIOSupport) return; //지원하지 않는것 차단
    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);
    return () => observer.disconnect();
  }, [targetRef?.current, root, rootMargin, JSON.stringify(threshold)]);

  return entry;
}
