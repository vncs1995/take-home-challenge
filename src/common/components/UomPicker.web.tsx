import React, { useState, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "./Text";
import { TextField } from "./TextField";
import { UnitOfMeasure, UOM_LABELS } from "@/data";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { customFonts } from "../theme/fonts";

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
    },
    label: {
      position: "absolute",
      top: -8,
      left: spacing.sm,
      zIndex: 1,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      color: colors.text.secondary,
      ...customFonts.regular.text.xxs
    },
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.md,
      paddingRight: spacing.lg,
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.layer.solid.light,
      borderRadius: borderRadius.md,
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

  return (
    <View style={styles.wrapper}>
      <View style={styles.trigger}>
        <Text size="xs" style={styles.label}>
          Unit
        </Text>
        <TextField
          value={search ? search : value}
          onChangeText={setSearch}
          onFocus={() => {
            setIsOpen(!isOpen);
          }}
          style={{ flex:1, marginRight: 16, borderWidth: 0, backgroundColor: "transparent" }}
        />
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          style={{ marginRight: 16 }}
          size={numbersAliasTokens.sizing.icon.lg}
          color={colors.text.secondary}
        />
      </View>
      {isOpen && (
        <View style={styles.dropDownStyle}>
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
