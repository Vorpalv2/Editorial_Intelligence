import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface SummaryStateType {
  pendingUrl: string | null;
  setPendingUrl: Dispatch<SetStateAction<string | null>>;
}

export const SummaryContext = createContext<undefined | SummaryStateType>(
  undefined,
);

export const SummaryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  return (
    <SummaryContext.Provider
      value={{
        pendingUrl,
        setPendingUrl,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummaryContext = () => {
  const context = useContext(SummaryContext);

  if (!context) {
    throw new Error("useSummary must be used inside a SummaryProvider");
  }
  return context;
};
