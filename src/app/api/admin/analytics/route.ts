import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // Get all digests with send counts
  const digests = await prisma.digest.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      weekOf: true,
      status: true,
      subject: true,
      createdAt: true,
      _count: { select: { sends: true } },
    },
  });

  // Get open/click counts per digest
  const digestIds = digests.map((d) => d.id);

  // Also check DigestOpen/DigestClick which use string digestId
  const [opens, clicks] = await Promise.all([
    prisma.digestOpen.groupBy({
      by: ["digestId"],
      _count: { id: true },
    }),
    prisma.digestClick.groupBy({
      by: ["digestId"],
      _count: { id: true },
    }),
  ]);

  // Unique opens per digest
  const uniqueOpens = await prisma.digestOpen.groupBy({
    by: ["digestId"],
    _count: { email: true },
  });

  const openMap = new Map(opens.map((o) => [o.digestId, o._count.id]));
  const uniqueOpenMap = new Map(uniqueOpens.map((o) => [o.digestId, o._count.email]));
  const clickMap = new Map(clicks.map((c) => [c.digestId, c._count.id]));

  const digestMetrics = digests.map((d) => ({
    id: d.id,
    weekOf: d.weekOf,
    subject: d.subject,
    status: d.status,
    createdAt: d.createdAt,
    sends: d._count.sends,
    opens: openMap.get(d.id) ?? 0,
    uniqueOpens: uniqueOpenMap.get(d.id) ?? 0,
    clicks: clickMap.get(d.id) ?? 0,
    openRate:
      d._count.sends > 0
        ? Math.round(((uniqueOpenMap.get(d.id) ?? 0) / d._count.sends) * 100)
        : 0,
    clickRate:
      d._count.sends > 0
        ? Math.round(((clickMap.get(d.id) ?? 0) / d._count.sends) * 100)
        : 0,
  }));

  // Top clicked links (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const topLinks = await prisma.digestClick.groupBy({
    by: ["url"],
    where: { clickedAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  // Totals
  const [totalContacts, subscribedContacts, totalSends] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "SUBSCRIBED" } }),
    prisma.digestSend.count(),
  ]);

  return NextResponse.json({
    digests: digestMetrics,
    topLinks: topLinks.map((l) => ({ url: l.url, clicks: l._count.id })),
    totals: {
      contacts: totalContacts,
      subscribed: subscribedContacts,
      sends: totalSends,
      digests: digests.length,
    },
  });
}
