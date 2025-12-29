import React, { useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Button } from "../common/components/Button";
import { Text } from "../common/components/Text";
import { UnitOfMeasure } from "@/data";
import { TextField } from "../common/components/TextField";
import { CurrencyField } from "../common/components/CurrencyField";
import { QuantityField } from "../common/components/QuantityField";
import { UomPicker } from "../common/components/UomPicker";
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers";
import { getColors } from "../common/theme/tokens/alias/colors";
import { type ThemeScheme } from "../common/theme/types";
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme";

type FormMode = "add-item" | "add-section";

type SwitcherProps = {
  value: FormMode;
  onChange: (mode: FormMode) => void;
};

type AddFormProps = {
  mode?: FormMode;
  onSave: (data: any) => void;
};

function getSwitcherStyles(theme: ThemeScheme) {
  const { spacing, borderRadius, outlineHeight } = numbersAliasTokens;
  const colors = getColors(theme);

  return StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    switcher: {
      flexDirection: "row",
      backgroundColor: colors.layer.solid.dark,
      borderRadius: borderRadius.sm,
      padding: outlineHeight.sm,
    },
    option: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    optionSelected: {
      backgroundColor: colors.layer.solid.light,
    },
    text: {
      color: colors.text.tertiary,
    },
    textSelected: {
      color: colors.text.primary,
    },
  });
}

function Switcher({ value, onChange }: SwitcherProps) {
  const { value: theme } = useCurrentThemeScheme();
  const styles = getSwitcherStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.switcher}>
        <Pressable
          style={[
            styles.option,
            value === "add-item" && styles.optionSelected,
          ]}
          onPress={() => onChange("add-item")}
        >
          <Text
            size="sm"
            style={[
              styles.text,
              value === "add-item" && styles.textSelected,
            ]}
          >
            Add Item
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.option,
            value === "add-section" && styles.optionSelected,
          ]}
          onPress={() => onChange("add-section")}
        >
          <Text
            size="sm"
            style={[
              styles.text,
              value === "add-section" && styles.textSelected,
            ]}
          >
            Add Group
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function getStyle() {
  const { spacing } = numbersAliasTokens;

  return StyleSheet.create({
    container: {
      padding: spacing.sm,
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
  const showSwitcher = !modeProp;
  const styles = getStyle();

  const [internalMode, setInternalMode] = useState<FormMode>("add-item");
  const mode = modeProp || internalMode;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("0");
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
    setPrice("0");
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
    (mode === "add-section" || parseFloat(price) > 0);

  const renderWebForm = () => (
    <>
      <View style={styles.field}>
        <TextField
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(parseInt(text) || 1)}
          keyboardType="number-pad"
          label="Quantity"
        />
      </View>
      <View style={styles.field}>
        <CurrencyField
          value={price}
          onChangeText={setPrice}
          label="Cost"
        />
      </View>
      <View style={styles.field}>
        <UomPicker value={uom} onSelect={setUom} />
      </View>
    </>
  );

  const renderMobileForm = () => (
    <>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <CurrencyField
            value={price}
            onChangeText={setPrice}
            label="Cost"
          />
        </View>
        <View style={styles.halfField}>
          <UomPicker value={uom} onSelect={setUom} />
        </View>
      </View>
      <QuantityField
        value={quantity}
        onDecrement={handleDecrement}
        onIncrement={handleIncrement}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {showSwitcher && (
        <Switcher value={internalMode} onChange={setInternalMode} />
      )}

      <View style={styles.field}>
        <TextField
          value={title}
          onChangeText={setTitle}
          label={mode === "add-item" ? "Item title" : "Group title"}
        />
      </View>

      {mode === "add-item" && (
        Platform.OS === "web" ? renderWebForm() : renderMobileForm()
      )}

      <View style={styles.formActions}>
        <Button onPress={handleSave} disabled={!isValid} style={styles.button}>
          Add {mode === "add-item" ? "Item" : "Group"}
        </Button>
      </View>
    </View>
  );
}
