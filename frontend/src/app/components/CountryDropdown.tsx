import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Country } from "..";

const COUNTRY_LABELS: Record<Country, string> = {
  south_korea: "South Korea",
  indonesia: "Indonesia",
  malaysia: "Malaysia",
  thailand: "Thailand",
  japan: "Japan",
  singapore: "Singapore",
  vietnam: "Vietnam",
  china: "China",
  taiwan: "Taiwan",
  philippines: "Philippines",
};

interface CountryDropdownProps {
  selectedCountries: Country[];
  onSelectionChange: React.Dispatch<React.SetStateAction<Country[]>>;
}

export const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selectedCountries,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCountry = (country: Country) => {
    onSelectionChange((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const displayText =
    selectedCountries.length === 0
      ? "Select countries..."
      : selectedCountries.length === 1
        ? COUNTRY_LABELS[selectedCountries[0]]
        : `${selectedCountries.length} countries selected`;

  return (
    <View>
      <Text style={styles.label}>Origin Country</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)}>
        <Text
          style={[
            styles.dropdownText,
            selectedCountries.length === 0 && styles.placeholder,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <ScrollView style={styles.optionsList}>
              {(Object.keys(COUNTRY_LABELS) as Country[]).map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.option,
                    selectedCountries.includes(country) &&
                      styles.selectedOption,
                  ]}
                  onPress={() => toggleCountry(country)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCountries.includes(country) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {COUNTRY_LABELS[country]}
                  </Text>
                  {selectedCountries.includes(country) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  placeholder: {
    color: "#9ca3af",
  },
  arrow: {
    fontSize: 12,
    color: "#6b7280",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "80%",
    maxHeight: "60%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectedOption: {
    backgroundColor: "#eff6ff",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  selectedOptionText: {
    color: "#2563eb",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "bold",
  },
});