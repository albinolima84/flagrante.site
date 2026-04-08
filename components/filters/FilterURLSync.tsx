"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useFilterStore } from "@/lib/store";
import { UF } from "@/lib/types";
import { UF_LIST, ANO_INICIO_DEFAULT, ANO_FIM_DEFAULT } from "@/lib/constants";

const VALID_UFS = new Set(UF_LIST.map((u) => u.sigla));

/**
 * Invisible component that syncs the Zustand filter store with URL search params.
 *
 * On mount: reads ?uf=, ?de=, ?ate= and initialises the store.
 * After init: writes store changes back to the URL (router.replace, no history push).
 *
 * Must be rendered inside a <Suspense> boundary because useSearchParams()
 * can suspend during SSR/static generation in Next.js App Router.
 */
export function FilterURLSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { uf, anoInicio, anoFim, setUF, setAnoInicio, setAnoFim } = useFilterStore();

  // `ready` flips to true after the init effect has run.
  // The sync effect skips until ready=true so it never fires with stale
  // default values before the URL params have been read.
  const [ready, setReady] = useState(false);

  // ── Step 1: initialise store from URL (once on mount) ──────────────────────
  useEffect(() => {
    const ufParam = searchParams.get("uf")?.toUpperCase();
    const de = Number(searchParams.get("de") || 0);
    const ate = Number(searchParams.get("ate") || 0);

    if (ufParam && VALID_UFS.has(ufParam as UF)) setUF(ufParam as UF);
    if (de >= ANO_INICIO_DEFAULT && de <= ANO_FIM_DEFAULT) setAnoInicio(de);
    if (ate >= ANO_INICIO_DEFAULT && ate <= ANO_FIM_DEFAULT) setAnoFim(ate);

    // React 18 batches setUF/setAnoInicio/setAnoFim + setReady into one render,
    // so the sync effect below will see the correct store values on its first run.
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 2: push store changes to URL (skips until ready) ──────────────────
  useEffect(() => {
    if (!ready) return;

    const params = new URLSearchParams();
    if (uf !== "BR") params.set("uf", uf);
    if (anoInicio !== ANO_INICIO_DEFAULT) params.set("de", String(anoInicio));
    if (anoFim !== ANO_FIM_DEFAULT) params.set("ate", String(anoFim));

    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [ready, uf, anoInicio, anoFim]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
