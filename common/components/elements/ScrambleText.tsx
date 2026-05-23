"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    if (!rootRef.current || !text) return;

    const el = rootRef.current;
    const chars = Array.from(el.querySelectorAll(".scramble-char")) as HTMLElement[];

    const handleMove = (e: PointerEvent) => {
      chars.forEach((c) => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          const original = c.dataset.content || "";
          // If already scrambling, ignore to prevent reset
          if (c.dataset.scrambling === "true") return;
          
          c.dataset.scrambling = "true";
          const totalFrames = (duration * (1 - dist / radius)) * 60;
          let frame = 0;
          
          const scramble = () => {
            if (frame >= totalFrames) {
              c.innerText = original;
              c.dataset.scrambling = "false";
              return;
            }
            if (frame % Math.max(1, Math.floor(1 / speed)) === 0) {
               c.innerText = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
            frame++;
            requestAnimationFrame(scramble);
          };
          
          requestAnimationFrame(scramble);
        }
      });
    };

    el.addEventListener("pointermove", handleMove);

    return () => {
      el.removeEventListener("pointermove", handleMove);
    };
  }, [radius, duration, speed, scrambleChars, text]);

  return (
    <div
      ref={rootRef}
      className={`m-[7vw] max-w-[800px] font-mono text-[clamp(14px,4vw,32px)] text-white ${className}`}
      style={style}
    >
      <p>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="scramble-char inline-block will-change-transform"
            data-content={char}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </p>
    </div>
  );
};

export default ScrambledText;
