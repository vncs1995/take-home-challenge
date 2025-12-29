import React, { forwardRef, useImperativeHandle, useState, useMemo, useRef, useEffect } from "react";
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
      zIndex: 2,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      borderRadius: 999,
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
  });
}

function getDropdownStyle(theme: ThemeScheme): React.CSSProperties {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: colors.layer.solid.light,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.outline.medium,
    borderRadius: borderRadius.md,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    maxHeight: 300,
    zIndex: 9999,
    overflow: "hidden",
  };
}

function getOptionsListStyle(): React.CSSProperties {
  return {
    maxHeight: 220,
    overflowY: "auto",
  };
}

export const UomPicker = forwardRef<UomPickerRef, UomPickerProps>(
  function UomPicker({ value, onSelect }, ref) {
    const { value: theme } = useCurrentThemeScheme();
    const styles = getStyleForTheme(theme);
    const dropdownStyle = getDropdownStyle(theme);
    const optionsListStyle = getOptionsListStyle();
    const colors = getColors(theme);

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      present: () => setIsOpen(true),
      dismiss: () => {
        setIsOpen(false);
        setSearch("");
      },
    }));

    // Close dropdown when clicking outside
    useEffect(() => {
      if (!isOpen) return;
      
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-uom-picker]')) {
          setIsOpen(false);
          setSearch("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

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
        ref={wrapperRef} 
        style={styles.wrapper}
        // @ts-ignore - web-only attribute
        dataSet={{ uomPicker: true }}
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
          <div 
            style={dropdownStyle}
            data-uom-picker="true"
          >
            <View style={styles.searchContainer}>
              <TextField
                value={search}
                onChangeText={setSearch}
                label="Search units..."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <div style={optionsListStyle}>
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
            </div>
          </div>
        )}
      </View>
    );
  }
);
