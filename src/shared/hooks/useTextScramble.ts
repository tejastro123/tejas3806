import { useState, useCallback, useRef } from "react";

const glyphs = "ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export const useTextScramble = (baseText: string) => {
  const [displayText, setDisplayText] = useState(baseText);
  const [isScrambling, setIsScrambling] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let frame = 0;
    const maxFrames = 15;
    const originalChars = baseText.split("");

    const animate = () => {
      frame++;

      const scrambled = originalChars.map((char, i) => {
        if (char === " ") return " ";
        // Gradually reveal original characters
        if (frame / maxFrames > (i / originalChars.length) + (Math.random() * 0.2)) {
          return char;
        }
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      }).join("");

      setDisplayText(scrambled);

      if (frame < maxFrames + 10) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(baseText);
        setIsScrambling(false);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
  }, [baseText, isScrambling]);

  return { displayText, scramble, isScrambling };
};
