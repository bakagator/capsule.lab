import type { CaseDecision } from "../types";

export const CASES: Record<string, CaseDecision> = {
  "ch1-profit-plan": {
    id: "ch1-profit-plan",
    title: "つむぎ堂 再建プラン",
    situation: [
      "赤字の霧は晴れた。だが、毎月の赤字そのものはまだ続いている。",
      "今の看板商品「つむぎ大福」は 1個200円、変動費80円。月に3,000個売れていて、固定費は月45万円。",
      "このままでは毎月9万円の赤字だ。次の3か月、どの手を打つ？",
    ],
    current: { price: 200, variableCost: 80, volume: 3000, fixedCost: 450000 },
    months: 3,
    options: [
      {
        id: "raise-price",
        label: "値上げする（200円 → 240円）",
        detail: "素材の良さを伝えて価格を上げる。一部の常連さんは離れるかもしれない。",
        economics: { price: 240, variableCost: 80, volume: 2900, fixedCost: 450000 },
        effects: { brand: 5, communityReputation: -5 },
        outcome:
          "「この味なら240円でも買うよ」という声の一方、毎朝来ていたおばあちゃんの足が遠のいた。販売数は少し減ったが、黒字に転換した。",
        tradeoff: "利益は改善したが、地域の日常使いのお客様との距離が少し開いた。",
        reasons: [
          "値上げすれば、必ず販売数も増えるから",
          "1個あたりの貢献利益が増え、損益分岐点の販売数が下がるから",
          "値上げすると固定費が減るから",
        ],
        consistentReason: 1,
        reasonFeedback:
          "値上げで貢献利益は 120円 → 160円 に増え、損益分岐点は 3,750個 → 約2,813個 に下がる。販売数が多少減っても、分岐点を上回れば黒字になる。",
      },
      {
        id: "focus-products",
        label: "商品を絞り込む",
        detail: "売れ残りの多い商品をやめ、大福に集中する。廃棄ロスが減り、作業も楽になる。",
        economics: { price: 200, variableCost: 65, volume: 3200, fixedCost: 450000 },
        effects: { employeeSatisfaction: 10, communityReputation: -3 },
        outcome:
          "廃棄が減り、源さんは「大福だけに集中できるのはありがたい」と笑顔に。看板商品の質も上がった。赤字は大きく縮んだが、まだわずかに残っている。",
        tradeoff: "従業員の負担と廃棄は減ったが、「季節の生菓子が好きだった」というお客様もいた。",
        reasons: [
          "品目を絞ると変動費（廃棄ロス）が下がり、貢献利益が増えるから",
          "品目を減らせば家賃が下がるから",
          "商品の種類は少ないほど、お客様は必ず喜ぶから",
        ],
        consistentReason: 0,
        reasonFeedback:
          "廃棄ロスは販売数に連動するコストなので変動費。80円 → 65円 に下がると貢献利益は135円になり、損益分岐点は約3,334個まで下がる。",
      },
      {
        id: "morning-market",
        label: "商店街の朝市に出店する",
        detail: "出店料と人手で固定費は月3万円増えるが、新しいお客様に出会える。",
        economics: { price: 200, variableCost: 80, volume: 3900, fixedCost: 480000 },
        effects: { communityReputation: 12, employeeSatisfaction: -6 },
        outcome:
          "朝市では「こんな店があったんだ」と若い家族連れが立ち寄ってくれた。販売数は大きく伸びたが、早朝の仕込みで源さんは少しお疲れ気味だ。",
        tradeoff: "地域とのつながりは深まったが、働く人の負担が増え、利益はまだ赤字のまま。",
        reasons: [
          "出店すれば変動費がゼロになるから",
          "売上さえ増えれば、利益は必ず増えるから",
          "固定費は少し増えるが、それ以上に販売数を伸ばして固定費を回収できるから",
        ],
        consistentReason: 2,
        reasonFeedback:
          "固定費が48万円に増えると損益分岐点は 48万÷120 ＝ 4,000個。販売数が分岐点に近づくほど赤字は縮む。「売上が増えれば必ず利益が増える」わけではない点に注意。",
      },
      {
        id: "shorten-hours",
        label: "営業時間を短くする",
        detail: "夕方以降を閉めて、パート代と光熱費（固定費）を月6万円削る。",
        economics: { price: 200, variableCost: 80, volume: 2850, fixedCost: 390000 },
        effects: { employeeSatisfaction: 8, communityReputation: -8 },
        outcome:
          "夕方に閉まるようになり、仕事帰りのお客様から「最近買えなくなった」と残念がる声が届いた。費用は下がったが、売上も減ってしまった。",
        tradeoff: "コストは下がったが、売上も同時に減り、赤字の縮小は限定的だった。",
        reasons: [
          "営業時間を短くすると、大福1個の原価が下がるから",
          "固定費を下げると、損益分岐点の販売数が下がるから",
          "お客様が減れば、赤字も減るから",
        ],
        consistentReason: 1,
        reasonFeedback:
          "固定費が39万円になれば損益分岐点は 39万÷120 ＝ 3,250個。ただし営業時間の短縮で販売数も減るため、コスト削減の効果が売上減で打ち消されやすい。",
      },
    ],
    exp: 60,
  },
};
