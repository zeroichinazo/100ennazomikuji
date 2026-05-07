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
    fortuneImage: "/img/fortune_shoukichi.png",
  },
  {
    slug: "k3t6ra",
    label: "中吉",
    answers: ["中吉", "ちゅうきち"],
    fortuneImage: "/img/fortune_chukichi.png",
  },
  {
    slug: "v9b1hs",
    label: "吉",
    answers: ["吉", "きち"],
    fortuneImage: "/img/fortune_kichi.png",
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
