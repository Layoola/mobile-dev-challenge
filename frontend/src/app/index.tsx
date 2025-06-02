import React, { useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { router, Stack } from "expo-router";
import { useFilters } from "./context/FiltersContext";
import CountryDropdown from "./components/CountryDropdown";
import SpicinessDropdown from "./components/SpicinessDropdown";
import ClearFiltersButton from "./components/ClearFiltersButton";
import { Ionicons } from "@expo/vector-icons";

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

export default function NoodleListScreen() {
  const {
    selectedCountries,
    selectedSpiciness,
    setSelectedCountries,
    setSelectedSpiciness,
    clearFilters,
    hasActiveFilters,
  } = useFilters();
  const { loading, error, data } = useQuery<{
    instantNoodles: NoodleData[];
  }>(GET_NOODLES);

  const filteredNoodles = useMemo(() => {
    if (!data?.instantNoodles) return [];

    return data.instantNoodles.filter((noodle) => {
      const countryMatch =
        selectedCountries.length === 0 ||
        selectedCountries.includes(noodle.originCountry);
      const spicinessMatch =
        selectedSpiciness.length === 0 ||
        selectedSpiciness.includes(noodle.spicinessLevel);

      return countryMatch && spicinessMatch;
    });
  }, [data?.instantNoodles, selectedCountries, selectedSpiciness]);

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Noodles",
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/favorites`)}
              style={styles.headerButton}
            >
              <Ionicons
                name="heart-outline"
                size={30}
                color="red"
                style={{ width: 30, height: 30 }}
              />
            </Pressable>
          ),
        }}
      />
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
          {filteredNoodles.length} noodle
          {filteredNoodles.length !== 1 ? "s" : ""} found
        </Text>

        <FlatList
          data={filteredNoodles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoodleItem {...item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },
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
  listContent: {
    paddingBottom: 20,
  },
  headerButton: {
    marginRight: 16,
    padding: 4,
  },
});