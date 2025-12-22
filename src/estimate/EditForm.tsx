import React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "../common/components/Text"
import { Button } from "../common/components/Button"
import { EstimateRow, EstimateSection, UnitOfMeasure } from "@/data"
import { useState } from "react"
import { TextField } from "../common/components/TextField"
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
		isEstimateRow(data) ? data.quantity.toString() : ""
	)
	const [uom, setUom] = useState<UnitOfMeasure>(
		isEstimateRow(data) ? data.uom : "EA"
	)

	const handleSave = () => {
		if (mode === "item") {
			onSave({
				...data,
				title,
				price: parseFloat(price),
				quantity: parseFloat(quantity),
				uom,
			})
		} else {
			onSave({ title })
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.field}>
				<Text style={styles.label}>Title</Text>
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
						<Text style={styles.label}>Price</Text>
						<TextField
							style={styles.input}
							value={price}
							onChangeText={setPrice}
							keyboardType="decimal-pad"
							label="Enter price"
							placeholderTextColor={colors.text.tertiary}
						/>
					</View>
					<View style={styles.field}>
						<Text style={styles.label}>Quantity</Text>
						<TextField
							style={styles.input}
							value={quantity}
							onChangeText={setQuantity}
							keyboardType="decimal-pad"
							label="Enter quantity"
							placeholderTextColor={colors.text.tertiary}
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
