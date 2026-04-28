import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { SummaryDepthModeEnum } from "@/src/generated/prisma/client";
import { useUser } from "@clerk/nextjs";

export interface SummaryType {
  summary: SummaryDepthModeEnum;
  setSummary: Dispatch<SetStateAction<SummaryDepthModeEnum>>;
}

export interface ModifiedSummaryType {
  summary: SummaryDepthModeEnum;
  setSummary: (summaryDepthType: SummaryDepthModeEnum) => void;
}

const SummaryContext = createContext<ModifiedSummaryType | undefined>(
  undefined,
);

export function AISummaryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [summary, setSummary] = useState<SummaryDepthModeEnum>("Balanced");
  // console.log(user?.unsafeMetadata.summary);

  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata.summary) {
      setSummary(user.unsafeMetadata.summary as SummaryDepthModeEnum);
    }
  }, [user, isLoaded]);

  // 2. Persistence: Update Clerk when state changes locally
  const updateSummary = async (newDepth: SummaryDepthModeEnum) => {
    setSummary(newDepth); // Update local UI immediately

    if (user) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            summary: newDepth,
          },
        });
      } catch (err) {
        console.error("Failed to save preference to Clerk:", err);
      }
    }
  };
  return (
    <SummaryContext.Provider value={{ summary, setSummary: updateSummary }}>
      {children}
    </SummaryContext.Provider>
  );
}

export const useAISummaryContext = () => {
  const context = useContext(SummaryContext);

  if (!context)
    throw new Error("Summary context must be used within a provider");

  return context;
};
