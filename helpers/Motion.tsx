"use client";
import { cn } from "@/src/lib/utils";
import {
  motion,
  HTMLMotionProps,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
import { useEffect } from "react";

// We extend HTMLMotionProps to get all standard 'article' and 'motion' attributes
interface ArticleMotionProps extends HTMLMotionProps<"article"> {
  children: React.ReactNode;
}
// We extend HTMLMotionProps to get all standard 'article' and 'motion' attributes
interface HeaderMotionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}
interface NumberAnimateMotion extends HTMLMotionProps<"p"> {
  children: React.ReactNode;
}
interface LoginMotionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function ArticleMotion({
  children,
  initial = { opacity: 0, y: 20 }, // Default values
  animate = { opacity: 1, y: 0 }, // Default values
  transition,
  className,
  ...props
}: ArticleMotionProps) {
  return (
    <motion.article
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.article>
  );
}

export function HeaderMotion({
  children,
  initial = { opacity: 0, y: 20 }, // Default values
  animate = { opacity: 1, y: 0 }, // Default values
  transition,
  className,
  ...props
}: HeaderMotionProps) {
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"],
    // "rgba(255, 255, 255, 0.3)"
  );

  // Map it to a subtle border or shadow too for that "floating" look
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["none", "0 4px 6px -1px rgb(0 0 0 / 0.1)"],
  );

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      style={{ boxShadow, backgroundColor }}
      className={cn(className, "rounded-xl p-2.5 pb-0 ")}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function NumberAnimateMotion({
  children,
  initial = { opacity: 0, y: 20 }, // Default values
  animate = { opacity: 1, y: 0 }, // Default values
  transition,
  className,
  ...props
}: NumberAnimateMotion) {
  return <p></p>;
}

export function Counter({ value = 100 }) {
  // 1. Create a raw motion value
  const count = useMotionValue(0);

  // 2. Add spring physics for that "smooth" bounce effect
  const rounded = useSpring(count, { stiffness: 50, damping: 15 });

  // 3. Format the number (optional: can add decimals or currency)
  const display = useTransform(rounded, (latest) => Math.round(latest));

  useEffect(() => {
    // 4. Update the motion value whenever the prop changes
    count.set(value);
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
}

export function LoginMotion({
  children,
  initial = { opacity: 0, rotateY: 180 }, // Default values
  animate = { opacity: 1, rotateY: 0 }, // Default values
  transition,
  className,
  ...props
}: LoginMotionProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
