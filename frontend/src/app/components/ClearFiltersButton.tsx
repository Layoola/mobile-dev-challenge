import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ClearFiltersButtonProps {
  onPress: () => void;
}

export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  onPress,
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>Clear All Filters</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    margin: 16,
    padding: 12,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});