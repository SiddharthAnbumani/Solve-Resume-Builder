"use client";

import { Link as ScrollLink } from "react-scroll";

// In-page link that scrolls smoothly to the element with id `to`.
// `offset` clears the 80px sticky navbar. Skips the animation for people who
// have "reduce motion" turned on. `href` keeps it a real, keyboard-focusable link.
export default function SmoothLink({ to, ...props }) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ScrollLink
      href={`#${to}`}
      to={to}
      smooth="easeInOutCubic"
      duration={reduceMotion ? 0 : 700}
      offset={-80}
      {...props}
    />
  );
}
