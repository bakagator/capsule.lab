import Image from "next/image";
import type { Hitorigoto, Mode } from "@/lib/types";

export default function Hero({
  mode,
  latest,
  count,
  avgGap,
}: {
  mode: Mode;
  latest?: Hitorigoto;
  count: number;
  avgGap: number;
}) {
  const isHonne = mode === "honne";
  const bubble = isHonne
    ? latest?.honne || "……（言えないことが、まだある）"
    : latest?.tatemae || "今日もがんばります！";

  return (
    <section
      className="rounded-3xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="relative">
        <div
          className="pt-20 px-4"
          style={{
            background: "#FFFFFF",
            filter: isHonne ? "grayscale(0.6) brightness(0.5)" : "none",
            transition: "filter 0.5s ease",
          }}
        >
          <Image
            src="/matsuda.jpg"
            alt="ノートパソコンに向かうマツダ"
            width={790}
            height={640}
            preload
            className="w-full h-auto block"
          />
        </div>

        {/* 吹き出し：タテマエ＝セリフ、ホンネ＝心の声 */}
        <div
          key={mode}
          className="pop-in absolute left-4 right-4 top-3 mx-auto w-fit max-w-full"
          style={{ transformOrigin: "bottom center" }}
        >
          <p
            className="px-4 py-2.5 text-[13px] leading-snug font-medium text-center"
            style={{
              background: isHonne ? "var(--honne-bg)" : "#FFFFFF",
              color: isHonne ? "var(--honne-text)" : "var(--tatemae-text)",
              border: isHonne ? "1.5px dashed var(--honne-border)" : "2px solid #1A1A1A",
              borderRadius: isHonne ? "28px" : "18px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {isHonne ? `（${bubble}）` : `「${bubble}」`}
          </p>
          {isHonne ? (
            <>
              <span className="absolute rounded-full" style={{ left: "58%", bottom: -16, width: 11, height: 11, background: "var(--honne-bg)", border: "1.5px dashed var(--honne-border)" }} />
              <span className="absolute rounded-full" style={{ left: "61%", bottom: -28, width: 7, height: 7, background: "var(--honne-bg)", border: "1.5px dashed var(--honne-border)" }} />
            </>
          ) : (
            <span
              className="absolute"
              style={{ left: "58%", bottom: -10, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "11px solid #1A1A1A" }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {isHonne ? "ここだけの話、ぜんぶ聞いて。" : "今日もいい人でいられました。"}
        </p>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-base font-bold leading-none" style={{ color: "var(--text)" }}>{count}</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>ひとりごと</p>
          </div>
          <div>
            <p className="text-base font-bold leading-none" style={{ color: "var(--text)" }}>{avgGap.toFixed(1)}</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>平均ギャップ</p>
          </div>
        </div>
      </div>
    </section>
  );
}
