import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ThreeDTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "cyan" | "purple";
  intensity?: number;
}

export const ThreeDText = ({ children, className = "", variant = "cyan", intensity = 20 }: ThreeDTextProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for rotation
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const text3dClass = variant === "cyan" ? "text-3d" : "text-3d-purple";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={`relative inline-block ${className}`}
    >
      <div
        className={`${text3dClass} transition-all duration-300`}
        style={{ transform: "translateZ(50px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
};
