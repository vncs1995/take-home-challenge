import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getColors } from "../theme/tokens/alias/colors";
import { getComponentTokens } from "../theme/tokens/components";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import { Text } from "./Text";

interface AddButtonProps {
  onPress?: () => void;
  text?: string;
}

function getStyleForTheme(theme: ThemeScheme, hasText: boolean) {
  const { sizing, borderRadius, spacing } = numbersAliasTokens;
  const colors = getColors(theme);
  const componentTokens = getComponentTokens(theme);

  return StyleSheet.create({
    sectionAddButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: componentTokens.button.background.secondary.idle,
      borderRadius: hasText
        ? componentTokens.button.borderRadius
        : borderRadius.pill,
      minWidth: sizing.icon.xl,
      minHeight: sizing.icon.xl,
      paddingHorizontal: hasText ? spacing.sm : 0,
      paddingVertical: hasText ? spacing.xs : 0,
      gap: hasText ? spacing["3xs"] : 0,
    },
    text: {
      color: colors.text.primary,
    },
  });
}

export const AddButton = ({ onPress, text }: AddButtonProps) => {
  const { value: theme } = useCurrentThemeScheme();
  const hasText = Boolean(text);
  const styles = getStyleForTheme(theme, hasText);
  const colors = getColors(theme);

  return (
    <Pressable style={styles.sectionAddButton} onPress={onPress}>
      <Ionicons name="add" size={24} color={colors.icon.primary} />
      {hasText && <Text style={styles.text}>{text}</Text>}
    </Pressable>
  );
};
