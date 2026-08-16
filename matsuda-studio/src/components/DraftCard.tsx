"use client";

import { useState } from "react";
import type { Draft, Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/platforms";

const STATUS_LABEL: Record<Draft["status"], string> = {
  pending: "確認待ち",
  approved: "承認済み",
  rejected: "却下",
  published: "投稿済み",
};

const STATUS_STYLE: Record<Draft["status"], string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  rejected: "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  published: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
};

export default function DraftCard({
  draft,
  onChange,
}: {
  draft: Draft;
  onChange: () => void;
}) {
  // 編集中のテキスト（platformごと）
  const [edits, setEdits] = useState<Record<string, string>>(
    Object.fromEntries(draft.variants.map((v) => [v.platform, v.text]))
  );
  const [busy, setBusy] = useState(false);

  async function patch(body: object) {
    setBusy(true);
    try {
      await fetch(`/api/drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function saveEdits() {
    await patch({
      variants: draft.variants.map((v) => ({
        platform: v.platform,
        text: edits[v.platform] ?? v.text,
      })),
    });
  }

  async function setStatus(status: Draft["status"]) {
    await patch({ status });
  }

  async function remove() {
    setBusy(true);
    try {
      await fetch(`/api/drafts/${draft.id}`, { method: "DELETE" });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    try {
      await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draft.id }),
      });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  function copyText(platform: Platform) {
    navigator.clipboard?.writeText(edits[platform] ?? "");
  }

  return (
    <article className="rounded-2xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[draft.status]}`}
          >
            {STATUS_LABEL[draft.status]}
          </span>
          {draft.mock && (
            <span className="ml-2 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
              モック生成（APIキー未設定）
            </span>
          )}
          {draft.source && (
            <p className="mt-2 truncate text-sm font-medium">
              {draft.source.title}
            </p>
          )}
          {draft.source?.link && (
            <a
              href={draft.source.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
            >
              元記事（{draft.source.source}）
            </a>
          )}
        </div>
        <button
          onClick={remove}
          disabled={busy}
          className="shrink-0 text-xs text-black/40 hover:text-red-600 dark:text-white/40"
        >
          削除
        </button>
      </header>

      <div className="space-y-3">
        {draft.variants.map((v) => {
          const meta = PLATFORMS[v.platform];
          const count = [...(edits[v.platform] ?? "")].length;
          const over = count > meta.charLimit;
          return (
            <div key={v.platform}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {meta.label}
                  {!meta.autoPost && (
                    <span className="ml-1 text-xs font-normal text-black/40 dark:text-white/40">
                      （半自動）
                    </span>
                  )}
                </span>
                <span
                  className={`text-xs ${over ? "text-red-600" : "text-black/40 dark:text-white/40"}`}
                >
                  {count}/{meta.charLimit}
                </span>
              </div>
              <textarea
                value={edits[v.platform] ?? ""}
                onChange={(e) =>
                  setEdits((s) => ({ ...s, [v.platform]: e.target.value }))
                }
                rows={meta.kind === "long" ? 5 : 3}
                className={`w-full rounded-lg border bg-white/80 p-2 text-sm dark:bg-black/20 ${
                  over
                    ? "border-red-400"
                    : "border-black/10 dark:border-white/10"
                }`}
              />
              <div className="mt-1 flex items-center gap-3">
                <button
                  onClick={() => copyText(v.platform)}
                  className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {v.platform === "note" ? "noteにコピー" : "コピー"}
                </button>
                {draft.publishResults?.[v.platform] && (
                  <span
                    className={`text-xs ${
                      draft.publishResults[v.platform].ok
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {draft.publishResults[v.platform].message}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={saveEdits}
          disabled={busy}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
        >
          編集を保存
        </button>
        {draft.status !== "approved" && draft.status !== "published" && (
          <button
            onClick={() => setStatus("approved")}
            disabled={busy}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            承認する
          </button>
        )}
        {draft.status !== "rejected" && (
          <button
            onClick={() => setStatus("rejected")}
            disabled={busy}
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
          >
            却下
          </button>
        )}
        {draft.status === "approved" && (
          <button
            onClick={publish}
            disabled={busy}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            各SNSへ投稿
          </button>
        )}
      </footer>
    </article>
  );
}
