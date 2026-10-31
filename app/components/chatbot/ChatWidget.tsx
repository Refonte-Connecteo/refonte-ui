"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, RotateCcw, X } from "lucide-react";
import { BOT_NAME, CHAT_NODES, START_NODE } from "@/lib/chatbot";
import type { ChatChoice } from "@/lib/chatbot";
import Robot from "./Robot";

const TYPING_MS = 550;
const HINT_DELAY_MS = 4000;
const HINT_DURATION_MS = 7000;
const HINT_STORAGE_KEY = "connecteo_chat_hint_seen";

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
  const [showHint, setShowHint] = useState(false);
  const [typing, setTyping] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>(() => botBubbles(START_NODE));
  const [steps, setSteps] = useState<Step[]>([]);
  const [nodeId, setNodeId] = useState(START_NODE);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | undefined>(undefined);

  const closePanel = () => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  useEffect(() => {
    const readSeen = () => {
      try {
        return sessionStorage.getItem(HINT_STORAGE_KEY) !== null;
      } catch {
        return false;
      }
    };
    if (readSeen()) return;

    const showTimer = window.setTimeout(() => {
      setShowHint(true);
      try {
        sessionStorage.setItem(HINT_STORAGE_KEY, "1");
      } catch {
        // Sans stockage, la bulle reviendra simplement à la prochaine page.
      }
    }, HINT_DELAY_MS);
    const hideTimer = window.setTimeout(() => setShowHint(false), HINT_DELAY_MS + HINT_DURATION_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

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

  const goTo = (choice: ChatChoice) => {
    const next = choice.next;
    if (!next) return;

    window.clearTimeout(typingTimer.current);
    setSteps((previous) => [...previous, { nodeId, bubbleCount: bubbles.length }]);
    setBubbles((previous) => [...previous, { from: "user", text: choice.label }]);
    setTyping(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    typingTimer.current = window.setTimeout(() => {
      setTyping(false);
      setNodeId(next);
      setBubbles((previous) => [...previous, ...botBubbles(next)]);
    }, reduced ? 0 : TYPING_MS);
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
        className={`fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5 ${
          open ? "pointer-events-none invisible" : ""
        }`}
      >
        {showHint && (
          <button
            type="button"
            onClick={() => { setShowHint(false); setOpen(true); }}
            className="menu-item-in absolute bottom-full right-2 mb-2 whitespace-nowrap rounded-2xl rounded-br-sm bg-white px-4 py-2 text-sm font-semibold text-[#096475] shadow-lg ring-1 ring-black/5"
          >
            Besoin d&apos;aide ?
          </button>
        )}
        <button
          ref={launcherRef}
          type="button"
          onClick={() => { setShowHint(false); setOpen(true); }}
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
                {CHAT_NODES[nodeId].choices.map((choice) => (
                  <li key={choice.label}>{renderChoice(choice)}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
