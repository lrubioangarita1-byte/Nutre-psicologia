import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Site";
import { ConsentFull } from "@/content/legal/consentimiento";
import { Terminos } from "@/content/legal/terminos";
import { Privacidad } from "@/content/legal/privacidad";

const DOCS = {
  terminos: { title: "Términos y Condiciones", Body: Terminos },
  privacidad: { title: "Política de Tratamiento de Datos Personales", Body: Privacidad },
  consentimiento: { title: "Consentimiento Informado", Body: ConsentFull },
} as const;

type DocId = keyof typeof DOCS;

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  return { title: DOCS[doc as DocId]?.title ?? "Documento" };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const entry = DOCS[doc as DocId];
  if (!Object.prototype.hasOwnProperty.call(DOCS, doc) || !entry) notFound();
  const { title, Body } = entry;
  return (
    <>
      <SiteHeader />
      <main className="legal narrow">
        <h1>{title}</h1>
        <Body />
      </main>
      <SiteFooter />
    </>
  );
}
