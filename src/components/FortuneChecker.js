"use client";

import { useState } from "react";
import Image from "next/image";

const STAGE = {
  INITIAL: "initial",
  CLEAR: "clear",
  ALL_CLEAR: "all-clear",
};

const normalizeAnswer = (value) => value.trim().toLowerCase();

const getShareUrl = (text) =>
  `https://x.com/intent/post?text=${encodeURIComponent(text)}`;

export default function FortuneChecker({ fortune }) {
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState(STAGE.INITIAL);

  const clearShareText = `100円なぞみくじ「${fortune.label}」をクリア！ #100円なぞみくじ`;
  const allClearShareText =
    "100円なぞみくじを完全クリア！5問全部大吉にした！ #100円なぞみくじ";

  const onSubmit = (event) => {
    event.preventDefault();

    const normalized = normalizeAnswer(answer);
    const isDaikichi =
      normalized === normalizeAnswer("大吉") ||
      normalized === normalizeAnswer("だいきち");
    const isCorrect = fortune.answers
      .map((item) => normalizeAnswer(item))
      .includes(normalized);

    if (stage === STAGE.INITIAL && isCorrect) {
      setStage(STAGE.CLEAR);
      setMessage("クリア！");
      setAnswer("");
      return;
    }

    if (stage === STAGE.CLEAR && isDaikichi) {
      setStage(STAGE.ALL_CLEAR);
      setMessage("完全クリア！");
      setAnswer("");
      return;
    }

    setMessage("不正解...");
  };

  const mvImage =
    stage === STAGE.ALL_CLEAR
      ? "/img/allclear.png"
      : stage === STAGE.CLEAR
        ? "/img/clear.png"
        : "/img/MV.png";

  return (
    <div className="fortune-page">
      <div className="fortune-card">
        <Image
          src={mvImage}
          alt="なぞみくじメイン画像"
          width={1200}
          height={630}
          className="fortune-main-image"
          priority
        />

        {stage !== STAGE.ALL_CLEAR && (
          <form className="answer-form" onSubmit={onSubmit}>
            <label htmlFor="answer-input" className="answer-label">
              答えを入力してください
            </label>
            <input
              id="answer-input"
              className="answer-input"
              type="text"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="例: 末吉 / すえきち"
            />
            <button className="judge-button" type="submit">
              判定する
            </button>
          </form>
        )}

        {message && <p className="message-text">{message}</p>}

        {stage === STAGE.CLEAR && (
          <>
            <Image
              src={fortune.fortuneImage}
              alt={`${fortune.label}のクリア画像`}
              width={1000}
              height={560}
              className="fortune-image"
            />
            <a
              href={getShareUrl(clearShareText)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Xでシェア"
              className="image-button-link"
            >
              <Image
                src="/img/button_1.png"
                alt="Xでシェア"
                width={1000}
                height={240}
                className="button-image"
              />
            </a>
          </>
        )}

        {stage === STAGE.ALL_CLEAR && (
          <div className="allclear-buttons">
            <a
              href={getShareUrl(allClearShareText)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Xでシェア"
              className="image-button-link"
            >
              <Image
                src="/img/button_1.png"
                alt="Xでシェア"
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
                src="/img/button_2.png"
                alt="ゼロイチHPへ"
                width={1000}
                height={240}
                className="button-image"
              />
            </a>
            <a
              href="https://x.com/0001_nazo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ゼロイチXへ"
              className="image-button-link"
            >
              <Image
                src="/img/button_3.png"
                alt="ゼロイチXへ"
                width={1000}
                height={240}
                className="button-image"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
