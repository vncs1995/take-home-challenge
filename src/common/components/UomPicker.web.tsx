import React, {
  useState,
  useMemo,
} from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "./Text";
import { TextField } from "./TextField";
import { UnitOfMeasure, UOM_LABELS } from "@/data";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

const UOM_OPTIONS = Object.keys(UOM_LABELS) as UnitOfMeasure[];

export type UomPickerRef = {
  present: () => void;
  dismiss: () => void;
};

type UomPickerProps = {
  value: UnitOfMeasure;
  onSelect: (uom: UnitOfMeasure) => void;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    wrapper: {
      width: "100%",
      position: "relative",
    },
    label: {
      position: "absolute",
      top: -8,
      left: spacing.sm,
      zIndex: 1,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      borderRadius: borderRadius.md,
      color: colors.text.secondary,
    },
    trigger: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.md,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing.sm,
    },
    triggerText: {
      color: colors.text.primary,
    },
    searchContainer: {
      padding: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline.light,
      backgroundColor: colors.layer.solid.light,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.layer.solid.light,
    },
    optionSelected: {
      backgroundColor: colors.layer.solid.medium,
    },
    optionLabel: {
      color: colors.text.primary,
    },
    optionCode: {
      color: colors.text.secondary,
    },
    dropDownStyle: {
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.md,
    },
    optionList: {
      maxHeight: 220,
      overflowY: "auto",
    },
  });
}

export const UomPicker = ({ value, onSelect }: UomPickerProps) => {
    const { value: theme } = useCurrentThemeScheme();
    const styles = getStyleForTheme(theme);
    const colors = getColors(theme);

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
      if (!search.trim()) return UOM_OPTIONS;
      const searchLower = search.toLowerCase();
      return UOM_OPTIONS.filter(
        (option) =>
          option.toLowerCase().includes(searchLower) ||
          UOM_LABELS[option].toLowerCase().includes(searchLower)
      );
    }, [search]);

    const handleSelect = (uom: UnitOfMeasure) => {
      onSelect(uom);
      setIsOpen(false);
      setSearch("");
    };

    const handleTriggerPress = () => {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearch("");
      }
    };

    return (
      <View
        style={styles.wrapper}
      >
        <Text size="xs" style={styles.label}>
          Unit of Measure
        </Text>
        <Pressable style={styles.trigger} onPress={handleTriggerPress}>
          <Text size="md" style={styles.triggerText}>
            {value}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text.secondary}
          />
        </Pressable>

        {isOpen && (
          <View style={styles.dropDownStyle}>
            <View style={styles.searchContainer}>
              <TextField
                value={search}
                onChangeText={setSearch}
                label="Search units..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.optionList}>
              {filteredOptions.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.option,
                    option === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text size="md" style={styles.optionLabel}>
                    {UOM_LABELS[option]}
                  </Text>
                  <Text size="sm" style={styles.optionCode}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };
