import { forwardRef, useImperativeHandle, useState } from "react"
import { Modal, View, type ModalProps } from "react-native"

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
  isPresented: () => boolean;
};

export const BottomSheet = forwardRef<BottomSheetRef, ModalProps>(
	function BottomSheet(props, ref) {
		const [isVisible, setIsVisible] = useState<boolean>(false)

		useImperativeHandle(ref, () => ({
			present: () => setIsVisible(true),
			dismiss: () => setIsVisible(false),
			isPresented: () => isVisible,
		}));

		return (
			<Modal visible={isVisible} {...props}>
				<View style={{ flex: 1 }}>
				{props.children}
				</View>
			</Modal>
		)
	}
)
