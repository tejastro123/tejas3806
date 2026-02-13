import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    // Hidden until first movement to avoid jumping from (0,0)
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleHoverStart);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHoverStart);
    };
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (max-width: 1024px) {
          * { cursor: auto !important; }
          .custom-cursor { display: none !important; }
        }
      `}</style>

      {/* Instant Main Cursor Ring */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan z-[9999] pointer-events-none mix-blend-screen flex items-center justify-center pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "rgba(6, 182, 212, 0.2)" : "rgba(6, 182, 212, 0)",
          boxShadow: isHovering
            ? "0 0 20px rgba(6, 182, 212, 0.6), inset 0 0 10px rgba(6, 182, 212, 0.4)"
            : "0 0 10px rgba(6, 182, 212, 0.3)",
          borderWidth: isHovering ? "2px" : "1px",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }} // Only scale/color transitions
      >
        {/* Inner dot - also perfectly synced */}
        <motion.div
          className="w-1 h-1 bg-neon-cyan rounded-full"
          animate={{ scale: isHovering ? 0.5 : 1 }}
        />
      </motion.div>

      {/* Second perfectly synced ring for extra glow bloom */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-12 h-12 rounded-full border border-neon-purple/20 z-[9998] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.4 : 1,
          opacity: isHovering ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
};

export default CustomCursor;

