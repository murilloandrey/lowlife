import { useCallback, useEffect, useState } from "react";

export function useClampedOverflow<T extends HTMLElement>(
  content: string,
  active = true,
) {
  const [element, setElement] = useState<T | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const measurementRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!active || !element) {
      setIsOverflowing(false);
      return;
    }

    let frameId = 0;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    };

    measure();

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(element);
    window.addEventListener("resize", scheduleMeasure);
    void document.fonts?.ready.then(scheduleMeasure);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [active, content, element]);

  return { measurementRef, isOverflowing };
}
