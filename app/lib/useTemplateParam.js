"use client";

import { useEffect, useState } from "react";
import { templates } from "./templates";

// The template chosen on the landing page, passed along as ?template=<id>.
// Returns null when there isn't a valid one.
export function useTemplateParam() {
  const [tpl, setTpl] = useState(null);
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("template");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTpl(templates.some((x) => x.id === t) ? t : null);
  }, []);
  return tpl;
}

export const dashboardUrl = (tpl) => (tpl ? `/dashboard?template=${tpl}` : "/dashboard");
