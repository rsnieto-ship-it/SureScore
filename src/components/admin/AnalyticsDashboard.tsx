"use client";

import { useState, useEffect } from "react";
import { Users, Send, Mail, MousePointerClick } from "lucide-react";

type DigestMetric = {
  id: string;
  weekOf: string;
  subject: string | null;
  status: string;
  sends: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
};

type AnalyticsData = {
  digests: DigestMetric[];
  topLinks: { url: string; clicks: number }[];
  totals: {
    contacts: number;
    subscribed: number;
    sends: number;
    digests: number;
  };
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
          <Icon className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-4 w-full rounded-full bg-gray-100">
      <div
        className="h-4 rounded-full bg-amber-500"
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Loading analytics...
      </div>
    );
  }

  if (!data) return null;

  const maxSends = Math.max(...data.digests.map((d) => d.sends), 1);

  return (
    <div>
      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <StatCard
          label="Total Contacts"
          value={data.totals.contacts.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Subscribed"
          value={data.totals.subscribed.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Total Sends"
          value={data.totals.sends.toLocaleString()}
          icon={Send}
        />
        <StatCard
          label="Digests Sent"
          value={data.totals.digests}
          icon={Mail}
        />
      </div>

      {/* Per-digest metrics table */}
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        Digest Performance
      </h2>
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Week
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Sends
              </th>
              <th className="w-48 px-4 py-3 font-medium text-gray-600" />
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Opens
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Open %
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Clicks
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Click %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.digests.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  No digests yet
                </td>
              </tr>
            ) : (
              data.digests.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">
                    {new Date(d.weekOf).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {d.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">
                    {d.sends.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Bar value={d.sends} max={maxSends} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-600">
                    {d.uniqueOpens.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-600">
                    {d.openRate}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-600">
                    {d.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-600">
                    {d.clickRate}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Top Clicked Links */}
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        Top Clicked Links (last 30 days)
      </h2>
      {data.topLinks.length === 0 ? (
        <p className="text-sm text-gray-400">No click data yet</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  URL
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.topLinks.map((link) => (
                <tr key={link.url} className="hover:bg-gray-50">
                  <td className="max-w-lg truncate px-4 py-3 text-gray-600">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-700 hover:underline"
                    >
                      {link.url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">
                    {link.clicks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
