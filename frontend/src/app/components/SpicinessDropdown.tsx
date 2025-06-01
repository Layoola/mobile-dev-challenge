import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const SPICINESS_LEVELS = [
  { value: 1, label: "Mild" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hot" },
  { value: 4, label: "Very Hot" },
  { value: 5, label: "Extremely Hot" },
];

interface SpicinessDropdownProps {
  selectedSpiciness: number[];
  onSelectionChange: React.Dispatch<React.SetStateAction<number[]>>;
}

export const SpicinessDropdown: React.FC<SpicinessDropdownProps> = ({
  selectedSpiciness,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSpiciness = (level: number) => {
    onSelectionChange((prev) =>
      prev.includes(level) ? prev.filter((s) => s !== level) : [...prev, level]
    );
  };

  const getDisplayText = () => {
    if (selectedSpiciness.length === 0) return "Select spiciness levels...";
    if (selectedSpiciness.length === 1) {
      const level = SPICINESS_LEVELS.find(
        (l) => l.value === selectedSpiciness[0]
      );
      return `${level?.label} (${level?.value})`;
    }
    return `${selectedSpiciness.length} levels selected`;
  };

  return (
    <View>
      <Text style={styles.label}>Spiciness Level</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)}>
        <Text
          style={[
            styles.dropdownText,
            selectedSpiciness.length === 0 && styles.placeholder,
          ]}
        >
          {getDisplayText()}
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
              {SPICINESS_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.option,
                    selectedSpiciness.includes(level.value) &&
                      styles.selectedOption,
                  ]}
                  onPress={() => toggleSpiciness(level.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSpiciness.includes(level.value) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {level.label} ({level.value})
                  </Text>
                  {selectedSpiciness.includes(level.value) && (
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