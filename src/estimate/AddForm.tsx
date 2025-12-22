import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "../common/components/Text";
import { Button } from "../common/components/Button";
import { UnitOfMeasure } from "@/data";
import { TextField } from "../common/components/TextField";
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers";
import { getColors } from "../common/theme/tokens/alias/colors";
import { type ThemeScheme } from "../common/theme/types";
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme";

type AddFormProps = {
  mode: "add-item" | "add-section";
  onSave: (data: any) => void;
  onClose: () => void;
};

function getStyleForTheme(theme: ThemeScheme) {
  const { spacing, borderRadius } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      padding: spacing.sm,
    },
    field: {
      marginBottom: spacing.sm,
    },
    label: {
      color: colors.text.primary,
      marginBottom: spacing["3xs"],
    },
    input: {
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.sm,
      padding: spacing.xs,
      marginTop: spacing["3xs"],
      backgroundColor: colors.layer.solid.light,
      color: colors.text.primary,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing["3xs"],
      gap: spacing.xs,
    },
    quantityButton: {
      width: spacing["2xl"],
      height: spacing["2xl"],
      borderRadius: borderRadius.sm,
      backgroundColor: colors.layer.alpha.lightNeutral,
      alignItems: "center",
      justifyContent: "center",
    },
    quantityButtonPressed: {
      backgroundColor: colors.layer.solid.dark,
    },
    quantityButtonText: {
      color: colors.text.primary,
    },
    quantityInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.outline.medium,
      borderRadius: borderRadius.sm,
      padding: spacing.xs,
      backgroundColor: colors.layer.solid.light,
      color: colors.text.primary,
      textAlign: "center",
    },
    formActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: spacing["2xs"],
      marginTop: spacing.lg,
    },
    button: {
      flex: 1,
      minWidth: 100,
    },
  });
}

export function AddForm({ mode, onSave, onClose }: AddFormProps) {
  const { value: theme } = useCurrentThemeScheme();
  const styles = getStyleForTheme(theme);
  const colors = getColors(theme);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [uom, setUom] = useState<UnitOfMeasure>("EA");

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (text: string) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      setQuantity(parsed);
    } else if (text === "") {
      setQuantity(1);
    }
  };

  const handleSave = () => {
    if (mode === "add-item") {
      onSave({
        title,
        price: parseFloat(price) || 0,
        quantity,
        uom,
      });
    } else {
      onSave({ title });
    }
  };

  const isValid =
    title.trim().length > 0 &&
    (mode === "add-section" || price.trim().length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextField
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={`Enter ${mode} title`}
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      {mode === "add-item" && (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Price</Text>
            <TextField
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="Enter price"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <Pressable
                onPress={handleDecrement}
                style={({ pressed }) => [
                  styles.quantityButton,
                  pressed && styles.quantityButtonPressed,
                ]}
              >
                <Text weight="bold" size="lg" style={styles.quantityButtonText}>
                  −
                </Text>
              </Pressable>
              <TextField
                style={styles.quantityInput}
                value={quantity.toString()}
                onChangeText={handleQuantityChange}
                keyboardType="number-pad"
                placeholderTextColor={colors.text.tertiary}
              />
              <Pressable
                onPress={handleIncrement}
                style={({ pressed }) => [
                  styles.quantityButton,
                  pressed && styles.quantityButtonPressed,
                ]}
              >
                <Text weight="bold" size="lg" style={styles.quantityButtonText}>
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      <View style={styles.formActions}>
        <Button onPress={handleSave} disabled={!isValid} style={styles.button}>
          Add {mode === "add-item" ? "add-Item" : "add-Section"}
        </Button>
      </View>
    </View>
  );
}
