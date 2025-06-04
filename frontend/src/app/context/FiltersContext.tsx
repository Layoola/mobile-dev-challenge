import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Country } from "..";

type FiltersContextType = {
  selectedCountries: Country[];
  selectedSpiciness: number[];
  setSelectedCountries: Dispatch<SetStateAction<Country[]>>;
  setSelectedSpiciness: Dispatch<SetStateAction<number[]>>;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [selectedSpiciness, setSelectedSpiciness] = useState<number[]>([]);

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedSpiciness([]);
  };

  const hasActiveFilters =
    selectedCountries.length > 0 || selectedSpiciness.length > 0;

  return (
    <FiltersContext.Provider
      value={{
        selectedCountries,
        selectedSpiciness,
        setSelectedCountries,
        setSelectedSpiciness,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
};