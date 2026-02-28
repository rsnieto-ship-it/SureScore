import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!contact) notFound();

  // Engagement history
  const [opens, clicks] = await Promise.all([
    prisma.digestOpen.findMany({
      where: { email: contact.email },
      orderBy: { openedAt: "desc" },
      take: 50,
    }),
    prisma.digestClick.findMany({
      where: { email: contact.email },
      orderBy: { clickedAt: "desc" },
      take: 50,
    }),
  ]);

  const statusColor: Record<string, string> = {
    SUBSCRIBED: "bg-green-50 text-green-700",
    UNSUBSCRIBED: "bg-red-50 text-red-700",
    CLEANED: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/admin/contacts"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to contacts
      </Link>

      {/* Contact Info */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {[contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
                contact.email}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{contact.email}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusColor[contact.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {contact.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {contact.phone && (
            <div>
              <span className="text-gray-400">Phone</span>
              <p className="text-gray-900">{contact.phone}</p>
            </div>
          )}
          {contact.districtName && (
            <div>
              <span className="text-gray-400">District</span>
              <p className="text-gray-900">{contact.districtName}</p>
            </div>
          )}
          {contact.title && (
            <div>
              <span className="text-gray-400">Title</span>
              <p className="text-gray-900">{contact.title}</p>
            </div>
          )}
          {contact.zip && (
            <div>
              <span className="text-gray-400">ZIP</span>
              <p className="text-gray-900">{contact.zip}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400">Source</span>
            <p className="text-gray-900">{contact.source ?? "—"}</p>
          </div>
          <div>
            <span className="text-gray-400">Added</span>
            <p className="text-gray-900">
              {contact.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {contact.tags.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-400">Tags</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {contact.tags.map((ct) => (
                <span
                  key={ct.tag.name}
                  className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {ct.tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Engagement History */}
      <div className="grid grid-cols-2 gap-6">
        {/* Opens */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Email Opens ({opens.length})
          </h2>
          {opens.length === 0 ? (
            <p className="text-sm text-gray-400">No opens recorded</p>
          ) : (
            <div className="space-y-2">
              {opens.map((open) => (
                <div
                  key={open.id}
                  className="rounded border border-gray-100 px-3 py-2 text-sm"
                >
                  <p className="text-gray-600">
                    Digest: <span className="font-mono text-xs">{open.digestId}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(open.openedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clicks */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Link Clicks ({clicks.length})
          </h2>
          {clicks.length === 0 ? (
            <p className="text-sm text-gray-400">No clicks recorded</p>
          ) : (
            <div className="space-y-2">
              {clicks.map((click) => (
                <div
                  key={click.id}
                  className="rounded border border-gray-100 px-3 py-2 text-sm"
                >
                  <p className="truncate text-gray-600" title={click.url}>
                    {click.url}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(click.clickedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
