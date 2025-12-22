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
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    label: {
      color: colors.text.tertiary,
      marginLeft: spacing.sm,
      marginBottom: spacing["3xs"],
    },
    container: {
      height: 56,
      borderWidth: 1,
      borderColor: colors.outline.dark,
      borderRadius: borderRadius.md,
      backgroundColor: colors.layer.solid.light,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.sm,
      alignItems: "center",
      justifyContent: "center",
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

  return (
    <View style={styles.wrapper}>
      <Text size="sm" style={styles.label}>
        {label}
      </Text>

      <View style={styles.container}>
        <Pressable
          onPress={onDecrement}
          hitSlop={10}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="remove" size={24} />
        </Pressable>

        <View style={styles.valueContainer}>
          <Text weight="bold" size="md">
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
          <Ionicons name="add" size={24} />
        </Pressable>
      </View>
    </View>
  );
}
