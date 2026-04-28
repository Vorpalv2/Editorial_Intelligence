"use client";

import { useAISummaryContext } from "@/context/aiSummaryType.context";
import { SummaryDepthModeEnum } from "@/src/generated/prisma/enums";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { toast } from "react-toastify";

export default function AISlider() {
  const options = ["Concise", "Balanced", "Comprehensive"];
  const { setSummary, summary } = useAISummaryContext();
  const { user } = useUser();

  const handleThemeChange = async (mode: string) => {
    // 1. Immediate UI update
    setSummary(mode as SummaryDepthModeEnum);

    // 2. Persist to Clerk (Optional: add error handling)
    try {
      await user?.update({
        unsafeMetadata: {
          preferredMode: mode,
          theme:
            mode === "Concise"
              ? "#38bdf8"
              : mode === "Balanced"
                ? "#818cf8"
                : "#3e646e",
        },
      });

      toast.success(`Switched to ${mode} mode`, {
        position: "bottom-right",
        autoClose: 2000,
        style: { backgroundColor: "#3e646e", color: "white" },
      });
    } catch (error) {
      toast.error("Failed to save preference");
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative flex justify-between items-center p-1 bg-surface-container-low rounded-full border border-outline-variant/20 overflow-hidden">
        {/* The Animated "Slider" Background */}
        <motion.div
          className="absolute h-[calc(100%-8px)] rounded-full bg-primary shadow-sm"
          initial={false}
          animate={{
            width: `calc(${100 / options.length}% - 8px)`,
            // Improved X calculation to keep the pill aligned within padding
            x: `calc(${options.indexOf(summary) * 100}% + 4px)`,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
        />

        {options.map((option) => {
          const isActive = summary === option;
          return (
            <label
              key={option}
              className={`relative z-10 flex-1 py-2 cursor-pointer text-center transition-colors duration-200
                text-[10px] font-bold uppercase tracking-widest
                ${isActive ? "text-white" : "text-primary hover:text-primary/70"}
              `}
            >
              <input
                type="radio"
                name="aislider"
                value={option} // Corrected: use the option value
                className="sr-only"
                checked={isActive}
                onChange={() => handleThemeChange(option)} // Corrected: pass the option directly
              />
              {option}{" "}
              {/* Corrected: show the option name, not the current state */}
            </label>
          );
        })}
      </div>
    </div>
  );
}
