import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Text } from "./Text";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";
import { getComponentTokens } from "../theme/tokens/components";
import { type ThemeScheme } from "../theme/types";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";

interface BadgeProps {
  type: "Draft" | "Ready";
  style?: StyleProp<ViewStyle>;
}

function getStyleForTheme(theme: ThemeScheme) {
  const componentTokens = getComponentTokens(theme);
  const { spacing, borderRadius } = numbersAliasTokens;

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing["3xs"],
      backgroundColor: "transparent",
      paddingHorizontal: spacing.xs,
      borderRadius: borderRadius.pill,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: componentTokens.badges.washedColors.outline.hollow,
    },
    text: {
      color: componentTokens.badges.washedColors.text.hollow,
    },
  });
}

export const Badge = ({ type, style }: BadgeProps) => {
  const { value: theme } = useCurrentThemeScheme();
  const styles = getStyleForTheme(theme);

  return (
    <View style={[styles.container, style]}>
      <Text size="sm" style={styles.text}>• {type}</Text>
    </View>
  );
};
