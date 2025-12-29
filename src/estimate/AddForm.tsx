import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Button } from "../common/components/Button";
import { Text } from "../common/components/Text";
import { UnitOfMeasure } from "@/data";
import { TextField } from "../common/components/TextField";
import { QuantityField } from "../common/components/QuantityField";
import { UomPicker } from "../common/components/UomPicker";
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers";
import { getColors } from "../common/theme/tokens/alias/colors";
import { type ThemeScheme } from "../common/theme/types";
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme";

type FormMode = "add-item" | "add-section";

type AddFormProps = {
  mode?: FormMode;
  onSave: (data: any) => void;
};

function getStyleForTheme(theme: ThemeScheme, showSwitcher: boolean) {
  const { spacing, borderRadius, outlineHeight } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      padding: spacing.sm,
    },
    switcherContainer: {
      marginBottom: spacing.md,
    },
    switcher: {
      flexDirection: "row",
      backgroundColor: colors.layer.solid.dark,
      borderRadius: borderRadius.sm,
      padding: outlineHeight.sm,
    },
    switcherOption: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    switcherOptionSelected: {
      backgroundColor: colors.layer.solid.light,
    },
    switcherText: {
      color: colors.text.tertiary,
    },
    switcherTextSelected: {
      color: colors.text.primary,
    },
    field: {
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    halfField: {
      flex: 1,
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

export function AddForm({ mode: modeProp, onSave }: AddFormProps) {
  const { value: theme } = useCurrentThemeScheme();
  const showSwitcher = !modeProp;
  const styles = getStyleForTheme(theme, showSwitcher);

  const [internalMode, setInternalMode] = useState<FormMode>("add-item");
  const mode = modeProp || internalMode;

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

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setQuantity(1);
    setUom("EA");
  };

  const handleSave = () => {
    if (mode === "add-item") {
      onSave({
        type: showSwitcher ? "item" : undefined,
        title,
        price: parseFloat(price) || 0,
        quantity,
        uom,
      });
    } else {
      onSave({ type: showSwitcher ? "section" : undefined, title });
    }
    if (showSwitcher) {
      resetForm();
    }
  };

  const isValid =
    title.trim().length > 0 &&
    (mode === "add-section" || price.trim().length > 0);

  return (
    <View style={styles.container}>
      {showSwitcher && (
        <View style={styles.switcherContainer}>
          <View style={styles.switcher}>
            <Pressable
              style={[
                styles.switcherOption,
                internalMode === "add-item" && styles.switcherOptionSelected,
              ]}
              onPress={() => setInternalMode("add-item")}
            >
              <Text
                size="sm"
                style={[
                  styles.switcherText,
                  internalMode === "add-item" && styles.switcherTextSelected,
                ]}
              >
                Add Item
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.switcherOption,
                internalMode === "add-section" && styles.switcherOptionSelected,
              ]}
              onPress={() => setInternalMode("add-section")}
            >
              <Text
                size="sm"
                style={[
                  styles.switcherText,
                  internalMode === "add-section" && styles.switcherTextSelected,
                ]}
              >
                Add Group
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.field}>
        <TextField
          value={title}
          onChangeText={setTitle}
          label={mode === "add-item" ? "Item title" : "Group title"}
        />
      </View>

      {mode === "add-item" && (
        <>
          <View style={styles.field}>
            <TextField
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              label="Cost"
            />
          </View>
          <View style={styles.field}>
            <QuantityField
              value={quantity}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
            />
          </View>
          <View style={styles.field}>
            <UomPicker value={uom} onSelect={setUom} />
          </View>
        </>
      )}

      <View style={styles.formActions}>
        <Button onPress={handleSave} disabled={!isValid} style={styles.button}>
          Add {mode === "add-item" ? "Item" : "Group"}
        </Button>
      </View>
    </View>
  );
}
