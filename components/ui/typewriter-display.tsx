"use client";

import { useState, useEffect } from "react";

export function TypewriterDisplay({
  text,
  speed = 15,
}: {
  text: string;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    if (!text) return;

    setDisplayedText("");
    setIsComplete(false);

    timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        if (timer) clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [text, speed]);

  return (
    <span className="text-sm leading-5 whitespace-pre-wrap">
      {displayedText}
      {!isComplete && (
        <span className="animate-pulse text-secondary-foreground">|</span>
      )}
    </span>
  );
}
