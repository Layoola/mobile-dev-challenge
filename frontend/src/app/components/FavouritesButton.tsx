import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../context/FavouritesContext";

export function FavoriteButton({ noodleId }: { noodleId: string }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isCurrentlyFavorite = isFavorite(noodleId);

  const toggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFromFavorites(noodleId);
    } else {
      addToFavorites(noodleId);
    }
  };

  return (
    <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
      <Ionicons
        name={isCurrentlyFavorite ? "heart" : "heart-outline"}
        size={24}
        color={isCurrentlyFavorite ? "#FF6B6B" : "#666"}
      />
      <Text
        style={[
          styles.favoriteButtonText,
          { color: isCurrentlyFavorite ? "#FF6B6B" : "#666" },
        ]}
      >
        {isCurrentlyFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    margin: 16,
  },
  favoriteButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});