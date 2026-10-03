"use client";

import { useEffect } from "react";
import { BRAND } from "@/lib/brand";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="narrow" style={{ padding: "80px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 30 }}>Algo salió mal</h1>
      <p className="app-sub" style={{ marginTop: 14 }}>
        Tus respuestas guardadas no se pierden. Intenta de nuevo en un momento; si el problema sigue, escríbenos a{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>
      <p className="app-sub">Si estás en crisis, no esperes: comunícate con la {BRAND.crisisLine}.</p>
      <button className="btn btn-primary" onClick={() => retry()}>Intentar de nuevo</button>
    </main>
  );
}
