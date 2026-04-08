import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DigestTracker from "./tracker";

export const dynamic = "force-dynamic";

export default async function DigestWebPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { id } = await params;
  const { e: email } = await searchParams;

  const digest = await prisma.digest.findUnique({
    where: { id },
    select: {
      id: true,
      weekOf: true,
      subject: true,
      htmlContent: true,
    },
  });

  if (!digest || !digest.htmlContent) {
    notFound();
  }

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>{digest.subject || "SureScore Intel Digest"}</title>
      </head>
      <main style={{ backgroundColor: "#f4f4f0", minHeight: "100vh", padding: "20px 0" }}>
        <div
          style={{ maxWidth: 640, margin: "0 auto" }}
          dangerouslySetInnerHTML={{ __html: digest.htmlContent }}
        />
      </main>
      <DigestTracker digestId={digest.id} email={email || null} />
    </>
  );
}
