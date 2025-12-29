import React from "react"
import { View, StyleSheet, Platform } from "react-native"
import { Button } from "../common/components/Button"
import { EstimateRow, EstimateSection, UnitOfMeasure } from "@/data"
import { useState } from "react"
import { TextField } from "../common/components/TextField"
import { CurrencyField } from "../common/components/CurrencyField"
import { QuantityField } from "../common/components/QuantityField"
import { UomPicker } from "../common/components/UomPicker"
import { numbersAliasTokens } from "../common/theme/tokens/alias/numbers"

type EditFormProps = {
	mode: "item" | "section"
	data: EstimateRow | EstimateSection
	onSave: (updates: any) => void
	onClose?: () => void
	showCancel?: boolean
}

function isEstimateRow(data: any): data is EstimateRow {
	return "price" in data && "quantity" in data && "uom" in data
}

function getStyle() {
	const { spacing } = numbersAliasTokens

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
		},
	})
}

export function EditForm({ mode, data, onSave, onClose, showCancel }: EditFormProps) {
	const styles = getStyle()

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
		onClose?.()
	}

	const renderWebForm = () => (
		<>
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
			<View style={styles.field}>
				<TextField
					value={quantity.toString()}
					onChangeText={(text) => setQuantity(parseInt(text) || 1)}
					keyboardType="number-pad"
					label="Quantity"
				/>
			</View>
		</>
	)

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
			<View style={styles.field}>
				<QuantityField
					value={quantity}
					onDecrement={handleDecrement}
					onIncrement={handleIncrement}
				/>
			</View>
		</>
	)

	return (
		<View style={styles.container}>
			<View style={styles.field}>
				<TextField
					value={title}
					onChangeText={setTitle}
					label={mode === "item" ? "Item title" : "Group title"}
				/>
			</View>

			{mode === "item" && (
				Platform.OS === "web" ? renderWebForm() : renderMobileForm()
			)}

			<View style={styles.formActions}>
				{showCancel && onClose && (
					<Button variant="destructive" onPress={onClose} style={styles.button}>
						Cancel
					</Button>
				)}
				<Button onPress={handleSave} style={styles.button}>
					Save
				</Button>
			</View>
		</View>
	)
}
