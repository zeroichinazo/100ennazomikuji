export const FORTUNE_PAGES = [
  {
    slug: "x7m2p9",
    label: "末吉",
    answers: ["末吉", "すえきち"],
    fortuneImage: "/img/fortune_suekichi.png",
  },
  {
    slug: "q4n8vd",
    label: "小吉",
    answers: ["小吉", "しょうきち"],
    fortuneImage: "/img/fortune_shokichi.png",
  },
  {
    slug: "k3t6ra",
    label: "中吉",
    answers: ["中吉", "ちゅうきち"],
    fortuneImage: "/img/fortune_chukichi.png",
  },
  {
    slug: "v9b1hs",
    label: "大凶",
    answers: ["大凶", "だいきょう"],
    fortuneImage: "/img/fortune_daikyo.png",
  },
  {
    slug: "m5z7wy",
    label: "凶",
    answers: ["凶", "きょう"],
    fortuneImage: "/img/fortune_kyou.png",
  },
];

export const FORTUNE_BY_SLUG = Object.fromEntries(
  FORTUNE_PAGES.map((page) => [page.slug, page]),
);

const SHARE_PATH_BY_LABEL = {
  大凶: "daikyo",
  凶: "kyo",
  中吉: "chukichi",
  末吉: "suekichi",
  小吉: "shokichi",
};

const SHARE_BASE_URL = "https://contents.zeroichinazo.com/100ennazomikuji";

const SHARE_HEADER = `◤￣￣￣￣￣￣￣￣￣￣￣￣
      ⛩️謎解きグッズ⛩️
     『100円なぞみくじ』
 ＿＿＿＿＿＿＿＿＿＿＿＿◢`;

export function getClearShareText(label) {
  const path = SHARE_PATH_BY_LABEL[label];
  const detailUrl = path ? `${SHARE_BASE_URL}/${path}` : SHARE_BASE_URL;

  return `${SHARE_HEADER}

私の運勢は、【${label}】でした！

#ゼロイチナゾミクジ

▼詳細はこちら
${detailUrl}`;
}

export function getAllClearShareText() {
  return `${SHARE_HEADER}

私の運勢は、【大吉】になりました！

#ゼロイチナゾミクジ

▼詳細はこちら
${SHARE_BASE_URL}/daikichi`;
}
