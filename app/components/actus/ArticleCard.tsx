import { ArrowRight, FileText } from "lucide-react";

export type NewsArticle = {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  fileUrl: string;
};

export function ArticleMeta({ article }: { article: NewsArticle }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="rounded-full bg-[#FFA900] px-3 py-1 font-semibold text-[#0b4f5c]">{article.type}</span>
      {article.date && <span className="text-[#0b6171]/70">{article.date}</span>}
    </p>
  );
}

function ReadLabel({ article }: { article: NewsArticle }) {
  return (
    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#008b87]">
      {article.fileUrl ? <FileText aria-hidden="true" className="h-4 w-4" /> : null}
      {article.fileUrl ? `Consulter le ${article.type.toLowerCase()}` : "Lire l'article"}
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  );
}

const CARD_CLASS =
  "group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] text-left shadow-[0_30px_50px_-30px_rgba(11,79,92,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_60px_-30px_rgba(11,79,92,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b4f5c]";

export function FeaturedArticleCard({ article, onOpen }: { article: NewsArticle; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className={`${CARD_CLASS} bg-white p-6 md:p-10`}>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#00aeaa] to-[#FFA900]" />
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0b6171]/60">À la une</p>
      <ArticleMeta article={article} />
      <h2 className="mt-4 max-w-3xl text-2xl font-bold leading-tight text-[#0b4f5c] md:text-3xl">{article.title}</h2>
      <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">{article.description}</p>
      <ReadLabel article={article} />
    </button>
  );
}

export function ArticleCard({ article, onOpen }: { article: NewsArticle; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className={`${CARD_CLASS} h-full min-h-56 bg-white p-6`}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00aeaa]/80 to-[#0b6171]/80" />
      <ArticleMeta article={article} />
      <h3 className="mt-4 line-clamp-3 text-lg font-bold leading-snug text-[#0b4f5c]">{article.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{article.description}</p>
      <ReadLabel article={article} />
    </button>
  );
}
