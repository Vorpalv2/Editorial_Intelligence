import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface RefreshingIDs {
  refreshingID: number[];
  setRefreshingID: Dispatch<SetStateAction<number[]>>;
}

const RefreshContext = createContext<RefreshingIDs | undefined>(undefined);

export function RefreshContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshID, setRefreshID] = useState<number[]>([]);

  return (
    <RefreshContext.Provider
      value={{ refreshingID: refreshID, setRefreshingID: setRefreshID }}
    >
      {children}
    </RefreshContext.Provider>
  );
}

export const useRefreshContext = () => {
  const context = useContext(RefreshContext);

  if (!context) throw Error("refresh context must be used within a provider");

  return context;
};
