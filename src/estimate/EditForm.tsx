import React from "react"
import { View, StyleSheet } from "react-native"
import { Button } from "../common/components/Button"
import { EstimateRow, EstimateSection, UnitOfMeasure } from "@/data"
import { useState } from "react"
import { TextField } from "../common/components/TextField"
import { QuantityField } from "../common/components/QuantityField"
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers"
import { getColors } from "../common/theme/tokens/alias/colors"
import { type ThemeScheme } from "../common/theme/types"
import { useCurrentThemeScheme } from "../common/hooks/useCurrentThemeScheme"

type EditFormProps = {
	mode: "item" | "section"
	data: EstimateRow | EstimateSection
	onSave: (updates: any) => void
	onClose: () => void
}

function isEstimateRow(data: any): data is EstimateRow {
	return "price" in data && "quantity" in data && "uom" in data
}

function getStyleForTheme(theme: ThemeScheme) {
	const { spacing, borderRadius } = numbersAliasTokens
	const colors = getColors(theme)

	return StyleSheet.create({
		container: {
			padding: spacing.sm,
		},
		field: {
			marginBottom: spacing.sm,
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
	})
}

export function EditForm({ mode, data, onSave, onClose }: EditFormProps) {
	const { value: theme } = useCurrentThemeScheme()
	const styles = getStyleForTheme(theme)
	const colors = getColors(theme)

	const [title, setTitle] = useState(data.title)
	const [price, setPrice] = useState(
		isEstimateRow(data) ? data.price.toString() : ""
	)
	const [quantity, setQuantity] = useState(
		isEstimateRow(data) ? data.quantity : 1
	)
	const [uom, setUom] = useState<UnitOfMeasure>(
		isEstimateRow(data) ? data.uom : "EA"
	)

	const handleIncrement = () => {
		setQuantity((prev) => prev + 1)
	}

	const handleDecrement = () => {
		setQuantity((prev) => Math.max(1, prev - 1))
	}

	const handleSave = () => {
		if (mode === "item") {
			onSave({
				...data,
				title,
				price: parseFloat(price),
				quantity,
				uom,
			})
		} else {
			onSave({ title })
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.field}>
				<TextField
					style={styles.input}
					value={title}
					onChangeText={setTitle}
					label={`Enter ${mode} title`}
					placeholderTextColor={colors.text.tertiary}
				/>
			</View>

			{mode === "item" && (
				<>
					<View style={styles.field}>
						<TextField
							style={styles.input}
							value={price}
							onChangeText={setPrice}
							keyboardType="decimal-pad"
							label="Cost"
							placeholderTextColor={colors.text.tertiary}
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
				<Button onPress={handleSave} style={styles.button}>
					Save
				</Button>
			</View>
		</View>
	)
}
