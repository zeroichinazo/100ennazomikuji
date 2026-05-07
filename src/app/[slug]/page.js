import { notFound } from "next/navigation";
import FortuneChecker from "@/components/FortuneChecker";
import { FORTUNE_BY_SLUG, FORTUNE_PAGES } from "@/lib/fortunePages";

export function generateStaticParams() {
  return FORTUNE_PAGES.map((page) => ({ slug: page.slug }));
}

export default function FortunePage({ params }) {
  const { slug } = params;
  const fortune = FORTUNE_BY_SLUG[slug];

  if (!fortune) {
    notFound();
  }

  return <FortuneChecker fortune={fortune} />;
}
