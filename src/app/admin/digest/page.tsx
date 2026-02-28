import { prisma } from "@/lib/db";
import DigestReview from "@/components/admin/DigestReview";

export default async function DigestPage() {
  const digest = await prisma.digest.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      candidates: { orderBy: { position: "asc" } },
      _count: { select: { sends: true } },
    },
  });

  if (!digest) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No digest yet
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Run <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">--preview</code> to generate candidates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DigestReview
      digest={{
        ...digest,
        weekOf: digest.weekOf.toISOString(),
        approvedAt: digest.approvedAt?.toISOString() ?? null,
        candidates: digest.candidates.map((c) => ({
          ...c,
          published: c.published.toISOString(),
        })),
      }}
    />
  );
}
