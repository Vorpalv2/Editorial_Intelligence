import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import { useContext } from "react";

type CountContextType = {
  totalEntries: number;
  currentPageEntries: number;
  setTotalEntries: Dispatch<SetStateAction<number>>;
  setCurrentPageEntries: Dispatch<SetStateAction<number>>;
};

const CountContext = createContext<CountContextType | undefined>(undefined);

export const CountContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPageEntries, setCurrentPageEntries] = useState(0);

  return (
    <CountContext.Provider
      value={{
        totalEntries,
        currentPageEntries,
        setTotalEntries,
        setCurrentPageEntries,
      }}
    >
      {children}
    </CountContext.Provider>
  );
};

export const useCountContext = () => {
  const context = useContext(CountContext);

  if (!context) {
    throw new Error("useCount must be used within a CountProvider");
  }

  return context;
};
