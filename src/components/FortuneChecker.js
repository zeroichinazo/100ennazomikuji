"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { getAllClearShareText, getClearShareText } from "@/lib/fortunePages";
import { getXShareUrl, shareToX } from "@/lib/shareToX";

const STAGE = {
  INITIAL: "initial",
  CLEAR: "clear",
  ALL_CLEAR: "all-clear",
};

const FEEDBACK = {
  CORRECT: "correct",
  WRONG: "wrong",
};

const storageKey = (slug) => `100ennazomikuji:${slug}`;

const NULL_SNAPSHOT = null;
const snapshotCache = new Map();

const getProgressSnapshot = (slug) => {
  if (typeof window === "undefined") {
    return NULL_SNAPSHOT;
  }

  let raw = "";
  try {
    raw = localStorage.getItem(storageKey(slug)) ?? "";
  } catch {
    return NULL_SNAPSHOT;
  }

  const cached = snapshotCache.get(slug);
  if (cached && cached.raw === raw) {
    return cached.data;
  }

  let data = NULL_SNAPSHOT;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = NULL_SNAPSHOT;
    }
  }

  snapshotCache.set(slug, { raw, data });
  return data;
};

const saveProgress = (slug, data) => {
  const raw = JSON.stringify(data);
  localStorage.setItem(storageKey(slug), raw);
  snapshotCache.set(slug, { raw, data });
  window.dispatchEvent(new Event("fortune-progress"));
};

const subscribeProgress = (callback) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("fortune-progress", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("fortune-progress", handler);
  };
};

const normalizeAnswer = (value) => value.trim().normalize("NFKC").toLowerCase();

function FeedbackMark({ type }) {
  if (type === FEEDBACK.CORRECT) {
    return (
      <div className="feedback-mark__group" aria-label="正解">
        <span className="feedback-mark__circle" aria-hidden="true" />
        <span className="feedback-mark__label feedback-mark__label--correct">
          正解！
        </span>
      </div>
    );
  }

  if (type === FEEDBACK.WRONG) {
    return (
      <div className="feedback-mark__group" aria-label="不正解">
        <span className="feedback-mark__cross" aria-hidden="true" />
        <span className="feedback-mark__label feedback-mark__label--wrong">
          不正解・・・
        </span>
      </div>
    );
  }

  return null;
}

function LinkButtons() {
  return (
    <>
      <a
        href="https://x.com/0001_nazo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ゼロイチXへ"
        className="image-button-link"
      >
        <Image
          src="/img/button_2.png"
          alt="ゼロイチXへ"
          width={1000}
          height={240}
          className="button-image"
        />
      </a>
      <a
        href="https://www.zeroichinazo.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ゼロイチHPへ"
        className="image-button-link"
      >
        <Image
          src="/img/button_3.png"
          alt="ゼロイチHPへ"
          width={1000}
          height={240}
          className="button-image"
        />
      </a>
    </>
  );
}

export default function FortuneChecker({ fortune }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [unlockedByFeedback, setUnlockedByFeedback] = useState(false);

  const [mountStage] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return getProgressSnapshot(fortune.slug)?.stage ?? null;
  });
  const wasClearAtMount = mountStage === STAGE.CLEAR;
  const wasAllClearAtMount = mountStage === STAGE.ALL_CLEAR;

  const persisted = useSyncExternalStore(
    subscribeProgress,
    () => getProgressSnapshot(fortune.slug),
    () => NULL_SNAPSHOT,
  );

  const stage =
    persisted?.stage === STAGE.CLEAR || persisted?.stage === STAGE.ALL_CLEAR
      ? persisted.stage
      : STAGE.INITIAL;
  const blockedAnswers = persisted?.blockedAnswers ?? [];

  const clearShareText = getClearShareText(fortune.label);
  const allClearShareText = getAllClearShareText();

  const firstStageAnswers = fortune.answers.map((item) =>
    normalizeAnswer(item),
  );

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedback(null);
      if (feedback === FEEDBACK.CORRECT) {
        setUnlockedByFeedback(true);
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const persistProgress = (nextStage, nextBlocked) => {
    saveProgress(fortune.slug, {
      stage: nextStage,
      blockedAnswers: nextBlocked,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (stage === STAGE.ALL_CLEAR) {
      return;
    }

    const normalized = normalizeAnswer(answer);

    if (!normalized) {
      return;
    }

    if (blockedAnswers.includes(normalized)) {
      setFeedback(FEEDBACK.WRONG);
      setAnswer("");
      return;
    }

    const isDaikichi =
      normalized === normalizeAnswer("大吉") ||
      normalized === normalizeAnswer("だいきち");
    const isFirstStageCorrect = firstStageAnswers.includes(normalized);

    if (stage === STAGE.INITIAL && isFirstStageCorrect) {
      const nextBlocked = [...blockedAnswers, normalized];
      persistProgress(STAGE.CLEAR, nextBlocked);
      setUnlockedByFeedback(false);
      setFeedback(FEEDBACK.CORRECT);
      setAnswer("");
      return;
    }

    if (stage === STAGE.CLEAR && isFirstStageCorrect) {
      setFeedback(FEEDBACK.WRONG);
      setAnswer("");
      return;
    }

    if (stage === STAGE.CLEAR && isDaikichi) {
      persistProgress(STAGE.ALL_CLEAR, blockedAnswers);
      setUnlockedByFeedback(false);
      setFeedback(FEEDBACK.CORRECT);
      setAnswer("");
      return;
    }

    setFeedback(FEEDBACK.WRONG);
    setAnswer("");
  };

  const hasClearedFirstStage =
    stage === STAGE.CLEAR || stage === STAGE.ALL_CLEAR;
  const showRewards =
    hasClearedFirstStage &&
    (wasClearAtMount ||
      wasAllClearAtMount ||
      unlockedByFeedback ||
      (stage === STAGE.ALL_CLEAR && !!feedback));
  const showDaikichiFortune =
    stage === STAGE.ALL_CLEAR &&
    !feedback &&
    (wasAllClearAtMount || unlockedByFeedback);
  const shareText = showDaikichiFortune ? allClearShareText : clearShareText;

  return (
    <div className="fortune-page">
      <div className="fortune-page__content">
        <div
          className={`fortune-judge-area${feedback ? " fortune-judge-area--feedback" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logo.svg"
            alt="100円なぞみくじ"
            className="fortune-logo"
          />

          <form
            className={`answer-form${stage === STAGE.ALL_CLEAR ? " answer-form--disabled" : ""}`}
            onSubmit={onSubmit}
          >
            <label htmlFor="answer-input" className="answer-label">
              問題の答えを入力しよう！
            </label>
            <input
              id="answer-input"
              className="answer-input"
              type="text"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={stage === STAGE.ALL_CLEAR}
            />
            <button
              className="judge-button"
              type="submit"
              disabled={stage === STAGE.ALL_CLEAR}
            >
              判定する
            </button>
          </form>

          {feedback && (
            <div className="feedback-mark-anchor">
              <FeedbackMark type={feedback} />
            </div>
          )}
        </div>

        <div className="fortune-rewards-area">
          {showRewards && (
            <>
              <div className="fortune-image-wrap">
                <Image
                  src={
                    showDaikichiFortune
                      ? "/img/fortune_daikichi.png"
                      : fortune.fortuneImage
                  }
                  alt={
                    showDaikichiFortune
                      ? "大吉"
                      : `${fortune.label}のクリア画像`
                  }
                  width={1000}
                  height={560}
                  className="fortune-image"
                  sizes="(max-width: 440px) 100vw, 440px"
                />
              </div>
              {!showDaikichiFortune && (
                <p className="fortune-hint">
                  メモ：あなたの運勢をさらに上げる方法があるかも…？
                </p>
              )}
              <a
                href={getXShareUrl(shareText)}
                rel="noopener noreferrer"
                aria-label="Xでシェア"
                className="image-button-link"
                onClick={(event) => {
                  event.preventDefault();
                  shareToX(shareText);
                }}
              >
                <Image
                  src="/img/button_1.png"
                  alt="Xでシェア"
                  width={1000}
                  height={240}
                  className="button-image"
                />
              </a>
              <LinkButtons />
            </>
          )}
        </div>
      </div>

      {feedback && <div className="feedback-backdrop" aria-hidden="true" />}
    </div>
  );
}
