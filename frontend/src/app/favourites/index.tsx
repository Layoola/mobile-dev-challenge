import React, { useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "../queries";
import { CountryDropdown } from "../components/CountryDropdown";
import { SpicinessDropdown } from "../components/SpicinessDropdown";
import { ClearFiltersButton } from "../components/ClearFiltersButton";
import { Stack } from "expo-router";
import { FavoriteNoodleItem } from "../components/FavouriteNoodleItem";
import { useFavorites } from "../context/FavouritesContext";
import { useFilters } from "../context/FiltersContext";

export type Country =
  | "south_korea"
  | "indonesia"
  | "malaysia"
  | "thailand"
  | "japan"
  | "singapore"
  | "vietnam"
  | "china"
  | "taiwan"
  | "philippines";

export type NoodleData = {
  id: string;
  name: string;
  spicinessLevel: number;
  originCountry: Country;
  rating: number;
};

export default function FavouritesScreen() {
  const {
    selectedCountries,
    selectedSpiciness,
    setSelectedCountries,
    setSelectedSpiciness,
    clearFilters,
    hasActiveFilters,
  } = useFilters();

  const { favorites } = useFavorites();

  const { loading, error, data } = useQuery<{
    instantNoodles: NoodleData[];
  }>(GET_NOODLES);

  const filteredFavoriteNoodles = useMemo(() => {
    if (!data?.instantNoodles) return [];

    // First filter by favorites, then by user filters
    const favoriteNoodles = data.instantNoodles.filter((noodle) =>
      favorites.includes(noodle.id)
    );

    return favoriteNoodles.filter((noodle) => {
      const countryMatch =
        selectedCountries.length === 0 ||
        selectedCountries.includes(noodle.originCountry);
      const spicinessMatch =
        selectedSpiciness.length === 0 ||
        selectedSpiciness.includes(noodle.spicinessLevel);

      return countryMatch && spicinessMatch;
    });
  }, [data?.instantNoodles, favorites, selectedCountries, selectedSpiciness]);

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Favourite Noodles" }} />

      <View style={styles.filtersContainer}>
        <View style={styles.filtersColumn}>
          <View style={styles.filterItem}>
            <CountryDropdown
              selectedCountries={selectedCountries}
              onSelectionChange={setSelectedCountries}
            />
          </View>
          <View style={styles.filterItem}>
            <SpicinessDropdown
              selectedSpiciness={selectedSpiciness}
              onSelectionChange={setSelectedSpiciness}
            />
          </View>
        </View>

        {hasActiveFilters && (
          <View style={styles.clearButtonContainer}>
            <ClearFiltersButton onPress={clearFilters} />
          </View>
        )}
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.resultCount}>
          {filteredFavoriteNoodles.length} favourite noodle
          {filteredFavoriteNoodles.length !== 1 ? "s" : ""} found
        </Text>

        {filteredFavoriteNoodles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {favorites.length === 0
                ? "No favourite noodles yet. Add some from the main list!"
                : "No favourite noodles match your current filters."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredFavoriteNoodles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FavoriteNoodleItem {...item} />}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
  filtersContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  filtersColumn: {
    gap: 12,
  },
  filterItem: {
    width: "100%",
  },
  clearButtonContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
});