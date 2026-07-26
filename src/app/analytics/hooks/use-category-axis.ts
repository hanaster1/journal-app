"use client";

import { useEffect, useState } from "react";

interface AxisSize {
  width: number;
  chars: number;
  fontSize: number;
}

const NARROW_AXIS: AxisSize = { width: 120, chars: 28, fontSize: 11 };

/**
 * A category axis wide enough to read on desktop leaves almost no room for the
 * bars on a phone, so shrink it below the `sm` breakpoint.
 */
export function useCategoryAxis(wide: AxisSize): AxisSize {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return isNarrow ? NARROW_AXIS : wide;
}
