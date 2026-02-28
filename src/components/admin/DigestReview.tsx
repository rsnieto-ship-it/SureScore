"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Eye,
  Send,
  Clock,
} from "lucide-react";

type Candidate = {
  id: string;
  position: number;
  title: string;
  summary: string;
  source: string;
  category: string;
  link: string;
  published: string;
  isTexas: boolean;
  selected: boolean;
  take: string | null;
};

type Digest = {
  id: string;
  weekOf: string;
  status: string;
  subject: string | null;
  htmlContent: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  candidates: Candidate[];
  _count?: { sends: number };
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  SENDING_BATCH_1: {
    label: "Sending Batch 1",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Loader2,
  },
  SENT_BATCH_1: {
    label: "Batch 1 Sent",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Send,
  },
  SENDING_BATCH_2: {
    label: "Sending Batch 2",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Loader2,
  },
  SENT_COMPLETE: {
    label: "Sent Complete",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
};

export default function DigestReview({ digest }: { digest: Digest }) {
  const [selected, setSelected] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    digest.candidates.forEach((c) => {
      if (c.selected) initial.add(c.id);
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDigest, setCurrentDigest] = useState(digest);

  const statusInfo = STATUS_CONFIG[currentDigest.status] ?? STATUS_CONFIG.PENDING_REVIEW;
  const StatusIcon = statusInfo.icon;
  const isEditable = currentDigest.status === "PENDING_REVIEW";

  function toggleCandidate(id: string) {
    if (!isEditable) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  }

  async function saveSelections() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/digest/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          digestId: currentDigest.id,
          candidateIds: Array.from(selected),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save selections");
    } finally {
      setSaving(false);
    }
  }

  async function generateAndApprove() {
    if (selected.size !== 5) {
      setError("Select exactly 5 articles before generating");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      // Save selections first
      const saveRes = await fetch("/api/admin/digest/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          digestId: currentDigest.id,
          candidateIds: Array.from(selected),
        }),
      });
      if (!saveRes.ok) throw new Error(await saveRes.text());

      // Trigger generation
      const genRes = await fetch("/api/admin/digest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digestId: currentDigest.id }),
      });
      if (!genRes.ok) throw new Error(await genRes.text());

      const result = await genRes.json();
      setCurrentDigest((prev) => ({
        ...prev,
        status: "APPROVED",
        htmlContent: result.htmlContent ?? prev.htmlContent,
        subject: result.subject ?? prev.subject,
        approvedAt: new Date().toISOString(),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digest Review</h1>
          <p className="text-sm text-gray-500">
            Week of{" "}
            {new Date(currentDigest.weekOf).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        {currentDigest._count && (
          <div className="text-right text-sm text-gray-500">
            <span className="font-medium text-gray-900">
              {currentDigest._count.sends}
            </span>{" "}
            emails sent
          </div>
        )}
      </div>

      {/* Status Banner */}
      <div
        className={`mb-6 flex items-center gap-2 rounded-lg border px-4 py-3 ${statusInfo.color}`}
      >
        <StatusIcon
          className={`h-4 w-4 ${
            currentDigest.status.includes("SENDING") ? "animate-spin" : ""
          }`}
        />
        <span className="text-sm font-medium">{statusInfo.label}</span>
        {currentDigest.approvedAt && (
          <span className="ml-auto text-xs opacity-70">
            Approved{" "}
            {new Date(currentDigest.approvedAt).toLocaleString()}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Candidate Cards */}
      {isEditable && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{selected.size}/5</span> selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={saveSelections}
              disabled={saving || selected.size === 0}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Selections"}
            </button>
            <button
              onClick={generateAndApprove}
              disabled={generating || selected.size !== 5}
              className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate & Approve"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {currentDigest.candidates.map((candidate) => {
          const isSelected = selected.has(candidate.id);
          return (
            <div
              key={candidate.id}
              onClick={() => toggleCandidate(candidate.id)}
              className={`rounded-lg border p-4 transition-colors ${
                isEditable ? "cursor-pointer" : ""
              } ${
                isSelected
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      {candidate.position}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                      {candidate.category}
                    </span>
                    {candidate.isTexas && (
                      <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        TX
                      </span>
                    )}
                    <span className="ml-auto text-xs text-gray-400">
                      {candidate.source}
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    <a
                      href={candidate.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-amber-700 hover:underline"
                    >
                      {candidate.title}
                    </a>
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {candidate.summary.slice(0, 200)}
                    {candidate.summary.length > 200 ? "..." : ""}
                  </p>
                  {candidate.take && (
                    <div className="mt-2 border-l-2 border-amber-300 bg-amber-50/50 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                        SureScore Take
                      </p>
                      <p className="mt-1 text-xs italic leading-relaxed text-gray-700">
                        {candidate.take}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* HTML Preview */}
      {currentDigest.htmlContent && (
        <div className="mt-8">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Hide" : "Show"} Email Preview
          </button>
          {showPreview && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <iframe
                srcDoc={currentDigest.htmlContent}
                className="h-[800px] w-full"
                title="Email preview"
                sandbox=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
