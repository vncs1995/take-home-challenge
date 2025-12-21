import { Pressable, StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useCurrentThemeScheme } from "../hooks/useCurrentThemeScheme";
import { getColors } from "../theme/tokens/alias/colors";
import { type ThemeScheme } from "../theme/types";
import { numbersAliasTokens } from "../theme/tokens/alias/numbers";

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius, outlineHeight } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.layer.solid.dark,
      borderRadius: borderRadius.sm,
    },
    toggleItem: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xs,
    },
    selected: {
      backgroundColor: colors.layer.solid.light,
      borderRadius: borderRadius.sm,
      borderColor: colors.layer.solid.dark,
      borderWidth: outlineHeight.sm,
    },
  });
}

export const ThemeSwitcher = () => {
  const { value, setValue } = useCurrentThemeScheme();
  const colors = getColors(value);
  const { sizing } = numbersAliasTokens;
  const styles = getStyleForTheme(value);

  function toggleTheme() {
    setValue(value === "light" ? "dark" : "light");
  }

  return (
    <Pressable onPress={toggleTheme}>
      <View
        style={[styles.container, { backgroundColor: colors.layer.solid.dark }]}
      >
        <View style={[value === "light" && styles.selected, styles.toggleItem]}>
          <Icon
            name="sunny-outline"
            size={sizing.icon.md}
            color={
              value === "light" ? colors.icon.secondary : colors.icon.tertiary
            }
          />
        </View>
        <View style={[value === "dark" && styles.selected, styles.toggleItem]}>
          <Icon
            name="moon-outline"
            size={sizing.icon.md}
            color={
              value === "dark" ? colors.icon.secondary : colors.icon.tertiary
            }
          />
        </View>
      </View>
    </Pressable>
  );
};
