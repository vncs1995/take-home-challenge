import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../common/components/Button";
import { UnitOfMeasure } from "@/data";
import { TextField } from "../common/components/TextField";
import { QuantityField } from "../common/components/QuantityField";
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
              label="Price"
            />
          </View>
          <View style={styles.field}>
            <QuantityField
              value={quantity}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
            />
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
