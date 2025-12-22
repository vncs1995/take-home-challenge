import type { EstimateRow, EstimateSection, UnitOfMeasure } from "@/data";
import { useEstimateContext } from "./context";

export function useEstimateScreen() {
  const {
    estimate,
    editMode,
    updateTitle,
    updateItem,
    updateSection,
    addSection,
    addItem,
    selectItem,
    selectSection,
    clearSelection,
  } = useEstimateContext();

  const handleSaveItem = (updatedItem: EstimateRow) => {
    if (editMode?.type !== "item") {
      return;
    }

    updateItem(updatedItem.id, updatedItem);
  };

  const handleSaveSection = (updates: Partial<EstimateSection>) => {
    if (editMode?.type !== "section") {
      return;
    }

    updateSection(editMode.data.id, updates);
  };

  const handleAddSection = (data: { title: string }) => {
    addSection(data.title);
  };

  const handleAddItem = (
    sectionId: string,
    data: { title: string; price: number; quantity: number; uom: UnitOfMeasure }
  ) => {
    addItem(sectionId, data);
  };

  return {
    estimate,
    editMode,
    updateTitle,
    handleStartItemEdit: selectItem,
    handleStartSectionEdit: selectSection,
    handleSaveItem,
    handleSaveSection,
    handleAddSection,
    handleAddItem,
    handleStopEdit: clearSelection,
  };
}
