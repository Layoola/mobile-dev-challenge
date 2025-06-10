import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "@noodle_favorites";

type FavoritesContextType = {
  favorites: string[];
  addToFavorites: (noodleId: string) => void;
  removeFromFavorites: (noodleId: string) => void;
  isFavorite: (noodleId: string) => boolean;
  loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const addToFavorites = (noodleId: string) => {
    const newFavorites = [...favorites, noodleId];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (noodleId: string) => {
    const newFavorites = favorites.filter((id) => id !== noodleId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (noodleId: string) => favorites.includes(noodleId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};