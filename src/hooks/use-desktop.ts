import { useEffect, useState } from "react";

/**
 * True at >=1024px (Tailwind `lg`). Defaults to false so SSR and the first
 * client paint match the approved mobile rendering exactly — desktop-only
 * behaviour is opted into after hydration, never before.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}
