"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ExternalLink, RotateCcw, SendHorizontal, X } from "lucide-react";
import { BOT_NAME, CHAT_NODES, START_NODE } from "@/lib/chatbot";
import type { ChatChoice, ChatNode } from "@/lib/chatbot";
import { SEARCH_EXAMPLES, searchSite } from "@/lib/teoSearch";
import Robot from "./Robot";

const TYPING_MS = 550;
// Petites bulles de Téo : la première après 3 s, puis une toutes les 12 s, 5 au maximum par page.
const HINT_FIRST_DELAY_MS = 3000;
const HINT_GAP_MS = 12000;
const HINT_DURATION_MS = 6000;
const HINT_MAX_PER_PAGE = 5;
const HINT_DISMISSED_KEY = "connecteo_chat_hint_dismissed";

const HINTS = [
  `Bonjour, je suis ${BOT_NAME} 👋`,
  "Posez-moi une question, je cherche pour vous.",
  `Essayez : « ${SEARCH_EXAMPLES.join(" », « ")} »…`,
  "Une offre précise ? Demandez-moi.",
  "Besoin d'aide ? Je vous oriente.",
];

/** Message propre à la page, glissé en deuxième position. */
const PAGE_HINTS: { prefix: string; text: string }[] = [
  { prefix: "/carriere", text: "Envie de nous rejoindre ? Je vous guide." },
  { prefix: "/contact", text: "Un projet ? Je peux vous orienter." },
  { prefix: "/actus", text: "Une actu vous intéresse ? Demandez-moi." },
  { prefix: "/notre-adn/a-propos", text: "Je vous raconte notre histoire, en haut de page !" },
  { prefix: "/impact", text: "Curieux de nos engagements ? Je suis là." },
];

function hintsFor(pathname: string): string[] {
  const page = PAGE_HINTS.find((h) => pathname.startsWith(h.prefix));
  return page ? [HINTS[0], page.text, ...HINTS.slice(1)] : HINTS;
}

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(HINT_DISMISSED_KEY) !== null;
  } catch {
    return false;
  }
}

type Bubble = { from: "bot" | "user"; text: string };
type Step = { nodeId: string; bubbleCount: number };

const botBubbles = (nodeId: string): Bubble[] =>
  CHAT_NODES[nodeId].messages.map((text) => ({ from: "bot", text }));

const CHOICE_CLASS =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border border-[#00AFA9]/40 bg-white px-4 py-2.5 text-left text-sm font-medium leading-snug text-[#096475] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00AFA9] hover:bg-[#00AFA9] hover:text-white hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA900]";

const ICON_BUTTON_CLASS =
  "flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFA900]";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [hint, setHint] = useState<string | null>(null);
  const [hintsDismissed, setHintsDismissed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>(() => botBubbles(START_NODE));
  const [steps, setSteps] = useState<Step[]>([]);
  const [nodeId, setNodeId] = useState(START_NODE);
  /** Réponses construites à partir d'une question libre (recherche dans le site). */
  const [searchNodes, setSearchNodes] = useState<Record<string, ChatNode>>({});
  const [question, setQuestion] = useState("");
  /** Page sur laquelle une zone [data-hide-teo] est à l'écran (le Téo de la page parle déjà). */
  const [hiddenOn, setHiddenOn] = useState<string | null>(null);
  const hidden = !open && hiddenOn === pathname;

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | undefined>(undefined);
  const searchCount = useRef(0);

  const closePanel = () => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  // Le Téo flottant s'efface tant qu'une section marquée data-hide-teo occupe l'écran (ex. « Notre histoire »).
  useEffect(() => {
    const zones = document.querySelectorAll("[data-hide-teo]");
    if (zones.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setHiddenOn(visible.size > 0 ? pathname : null);
      },
      // Visible = la section couvre encore le bas de l'écran, là où se tient le Téo flottant.
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    zones.forEach((zone) => observer.observe(zone));
    return () => observer.disconnect();
  }, [pathname]);

  // Bulles périodiques : jamais pendant la discussion, et plus du tout une fois masquées (pour la visite).
  useEffect(() => {
    if (open || hintsDismissed || readDismissed()) return;
    const messages = hintsFor(pathname);
    const timers: number[] = [];
    for (let i = 0; i < Math.min(HINT_MAX_PER_PAGE, messages.length); i++) {
      const showAt = HINT_FIRST_DELAY_MS + i * (HINT_DURATION_MS + HINT_GAP_MS);
      timers.push(window.setTimeout(() => setHint(messages[i]), showAt));
      timers.push(window.setTimeout(() => setHint(null), showAt + HINT_DURATION_MS));
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      setHint(null);
    };
  }, [open, hintsDismissed, pathname]);

  const dismissHints = () => {
    setHint(null);
    setHintsDismissed(true);
    try {
      sessionStorage.setItem(HINT_DISMISSED_KEY, "1");
    } catch {
      // Sans stockage, les bulles s'arrêtent seulement jusqu'au prochain chargement.
    }
  };

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => launcherRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Le dernier message reste visible : les longues listes se lisent depuis leur début.
    const lastBubble = el.querySelector("[aria-live]")?.lastElementChild as HTMLElement | null;
    const top = typing || !lastBubble ? el.scrollHeight : lastBubble.offsetTop - 12;
    el.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }, [bubbles, typing, open]);

  const nodeOf = (id: string): ChatNode => searchNodes[id] ?? CHAT_NODES[id];

  /** Affiche la question du visiteur, « Téo écrit… », puis la réponse. */
  const reply = (userText: string, next: string, node: ChatNode) => {
    window.clearTimeout(typingTimer.current);
    setSteps((previous) => [...previous, { nodeId, bubbleCount: bubbles.length }]);
    setBubbles((previous) => [...previous, { from: "user", text: userText }]);
    setTyping(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    typingTimer.current = window.setTimeout(() => {
      setTyping(false);
      setNodeId(next);
      setBubbles((previous) => [...previous, ...node.messages.map((text) => ({ from: "bot" as const, text }))]);
    }, reduced ? 0 : TYPING_MS);
  };

  const goTo = (choice: ChatChoice) => {
    if (choice.next) reply(choice.label, choice.next, nodeOf(choice.next));
  };

  /** Question libre : Téo cherche dans les pages, les offres et les réponses pratiques du site. */
  const ask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || typing) return;
    setQuestion("");

    const results = searchSite(text);
    const best = results[0];
    const node: ChatNode =
      results.length === 0
        ? {
            messages: [`Je n'ai rien trouvé pour « ${text} ».`, "Essayez avec un autre mot, ou écrivez à notre équipe."],
            choices: [{ label: "Écrire un message", href: "/contact" }, { label: "Revenir au menu", next: START_NODE }],
          }
        : {
            messages: best.answer ? [...best.answer, "Pour en savoir plus :"] : ["Voici ce que j'ai trouvé sur le site :"],
            choices: [
              ...results.map((entry) => ({ label: entry.title, href: entry.href })),
              { label: "Revenir au menu", next: START_NODE },
            ],
          };
    searchCount.current += 1;
    const id = `search:${searchCount.current}`;
    setSearchNodes((previous) => ({ ...previous, [id]: node }));
    reply(text, id, node);
  };

  const goBack = () => {
    const previous = steps[steps.length - 1];
    if (!previous) return;
    window.clearTimeout(typingTimer.current);
    setTyping(false);
    setNodeId(previous.nodeId);
    setBubbles((current) => current.slice(0, previous.bubbleCount));
    setSteps((current) => current.slice(0, -1));
  };

  const restart = () => {
    window.clearTimeout(typingTimer.current);
    setTyping(false);
    setNodeId(START_NODE);
    setBubbles(botBubbles(START_NODE));
    setSteps([]);
  };

  const renderChoice = (choice: ChatChoice) => {
    if (!choice.href) {
      return (
        <button type="button" className={CHOICE_CLASS} onClick={() => goTo(choice)}>
          {choice.label}
        </button>
      );
    }
    if (choice.href.startsWith("http")) {
      return (
        <a href={choice.href} target="_blank" rel="noopener noreferrer" className={CHOICE_CLASS}>
          {choice.label}
          <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
        </a>
      );
    }
    return (
      <Link href={choice.href} className={CHOICE_CLASS} onClick={() => setOpen(false)}>
        {choice.label}
      </Link>
    );
  };

  return (
    <>
      {/* Robot qui se balade en bas à droite */}
      <div
        inert={hidden}
        className={`fixed bottom-3 right-3 z-40 transition-all duration-500 sm:bottom-5 sm:right-5 ${
          open ? "pointer-events-none invisible" : ""
        } ${hidden ? "pointer-events-none translate-y-6 opacity-0" : ""}`}
      >
        {hint && !hidden && (
          <div
            key={hint}
            className="menu-item-in absolute bottom-full right-2 mb-2 flex items-center rounded-2xl rounded-br-sm bg-white text-sm font-semibold text-[#096475] shadow-lg ring-1 ring-black/5"
          >
            <button
              type="button"
              onClick={() => { setHint(null); setOpen(true); }}
              className="whitespace-nowrap rounded-l-2xl py-2 pl-4 pr-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFA900]"
            >
              {hint}
            </button>
            <button
              type="button"
              onClick={dismissHints}
              aria-label={`Ne plus afficher les messages de ${BOT_NAME}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#096475]/50 transition-colors hover:text-[#096475] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFA900]"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <button
          ref={launcherRef}
          type="button"
          onClick={() => { setHint(null); setOpen(true); }}
          aria-label={`Ouvrir l'aide avec ${BOT_NAME}, le robot de Connecteo`}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="robot-walker group block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA900]"
        >
          <span className="robot-flip block">
            <Robot className="h-18 w-16 transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-18" />
          </span>
        </button>
      </div>

      {/* Fenêtre de discussion */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={`Discussion avec ${BOT_NAME}`}
          tabIndex={-1}
          className="menu-item-in fixed inset-x-3 bottom-3 z-[60] flex max-h-[min(36rem,calc(100svh-1.5rem))] flex-col overflow-hidden rounded-3xl bg-[#F4F8F8] shadow-2xl shadow-black/30 outline-none ring-1 ring-black/5 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[22.5rem]"
        >
          <header className="flex shrink-0 items-center gap-1 bg-[#096475] py-1.5 pl-3 pr-1.5 text-white">
            <Robot className="robot-still h-12 w-11 shrink-0" />
            <div className="ml-1 min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{BOT_NAME}</p>
              <p className="truncate text-xs text-white/70">Assistant Connecteo</p>
            </div>
            <button type="button" onClick={goBack} disabled={steps.length === 0} aria-label="Revenir à la question précédente" className={ICON_BUTTON_CLASS}>
              <ArrowLeft aria-hidden="true" className="h-4.5 w-4.5" />
            </button>
            <button type="button" onClick={restart} disabled={steps.length === 0} aria-label="Recommencer la discussion" className={ICON_BUTTON_CLASS}>
              <RotateCcw aria-hidden="true" className="h-4.5 w-4.5" />
            </button>
            <button type="button" onClick={closePanel} aria-label="Fermer la discussion" className={ICON_BUTTON_CLASS}>
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <div aria-live="polite" className="space-y-2">
              {bubbles.map((bubble, index) => (
                <p
                  key={index}
                  className={`menu-item-in w-fit max-w-[85%] break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    bubble.from === "bot"
                      ? "rounded-bl-sm bg-white text-[#0B1D20] shadow-sm"
                      : "ml-auto rounded-br-sm bg-[#096475] text-white"
                  }`}
                >
                  {bubble.text}
                </p>
              ))}
              {typing && (
                <p className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3.5 shadow-sm">
                  <span className="sr-only">{BOT_NAME} écrit…</span>
                  <span className="chat-dot" />
                  <span className="chat-dot [animation-delay:150ms]" />
                  <span className="chat-dot [animation-delay:300ms]" />
                </p>
              )}
            </div>

            {!typing && (
              <ul key={nodeId} className="menu-item-in mt-3 space-y-2">
                {nodeOf(nodeId).choices.map((choice) => (
                  <li key={choice.label}>{renderChoice(choice)}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Question libre */}
          <form onSubmit={ask} className="flex shrink-0 items-center gap-2 border-t border-black/5 bg-white p-2.5">
            <label htmlFor="teo-question" className="sr-only">
              Posez votre question à {BOT_NAME}
            </label>
            <input
              id="teo-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={120}
              autoComplete="off"
              placeholder="Posez votre question…"
              className="min-h-11 min-w-0 flex-1 rounded-full bg-[#F4F8F8] px-4 text-sm text-[#0B1D20] outline-none ring-1 ring-black/5 placeholder:text-[#0B1D20]/40 focus:ring-2 focus:ring-[#00AFA9]"
            />
            <button
              type="submit"
              disabled={!question.trim() || typing}
              aria-label="Envoyer la question"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#096475] text-white transition-colors hover:bg-[#00AFA9] disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA900]"
            >
              <SendHorizontal aria-hidden="true" className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
