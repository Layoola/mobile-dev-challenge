import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FilterBtnProps {
  onPress: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export const FilterButton: React.FC<FilterBtnProps> = ({
  onPress,
  hasActiveFilters,
  activeFilterCount,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterButton, hasActiveFilters && styles.activeFilterButton]}
  >
    <Text
      style={[
        styles.filterButtonText,
        hasActiveFilters && styles.activeFilterText,
      ]}
    >
      Filter {hasActiveFilters && `(${activeFilterCount})`}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e9ecef",
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: "#e3f2fd",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  activeFilterText: {
    color: "#007bff",
  },
});