import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "./Text";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

type QuantityFieldProps = {
  label?: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius, sizing } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      position: "absolute",
      top: -8,
      left: spacing.sm,
      zIndex: 2,
      backgroundColor: colors.layer.solid.light,
      paddingHorizontal: spacing["3xs"],
      borderRadius: borderRadius.md,
      color: colors.text.secondary,
    },
    container: {
      height: 56,
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.md,
      backgroundColor: colors.layer.solid.light,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
    },
    button: {
      width: sizing.icon.lg,
      height: sizing.icon.lg,
      borderRadius: borderRadius.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    quantity: {
        color: colors.text.primary,
    },
    buttonPressed: {
      backgroundColor: colors.layer.alpha.lightNeutral,
    },
    valueContainer: {
      flex: 1,
      alignItems: "center",
    },
  });
}

export function QuantityField({
  label = "Quantity",
  value,
  onDecrement,
  onIncrement,
}: QuantityFieldProps) {
  const { value: theme } = useCurrentThemeScheme();
  const styles = getStyleForTheme(theme);
  const colors = getColors(theme);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text size="xs" style={styles.label}>
          {label}
        </Text>

        <Pressable
          onPress={onDecrement}
          hitSlop={10}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="remove" size={24} color={colors.icon.primary} />
        </Pressable>

        <View style={styles.valueContainer}>
          <Text weight="bold" size="md" style={styles.quantity}>
            {value}
          </Text>
        </View>

        <Pressable
          onPress={onIncrement}
          hitSlop={10}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="add" size={24} color={colors.icon.primary} />
        </Pressable>
      </View>
    </View>
  );
}
