import { createContext, useContext, useMemo } from "react";
import type { Estimate, EstimateRow, EstimateSection } from "@/data";
import { PropsWithChildren, useState } from "react";
import { sampleEstimate } from "@/data";

export type EditMode =
  | {
      type: "item";
      data: EstimateRow;
    }
  | {
      type: "section";
      data: EstimateSection;
    }
  | null;

interface EstimateContextValue {
  estimate: Estimate;
  editMode: EditMode;
  updateTitle: (title: string) => void;
  updateSection: (sectionId: string, updates: Partial<EstimateSection>) => void;
  updateItem: (rowId: string, updates: Partial<EstimateRow>) => void;
  addSection: (title: string) => void;
  addItem: (sectionId: string, item: Omit<EstimateRow, "id">) => void;
  selectItem: (item: EstimateRow) => void;
  selectSection: (section: EstimateSection) => void;
  clearSelection: () => void;
}

export const EstimateContext = createContext<EstimateContextValue | null>(null);

export function EstimateProvider({ children }: PropsWithChildren) {
  const [estimate, setEstimate] = useState<Estimate>(sampleEstimate);
  const [editMode, setEditMode] = useState<EditMode>(null);

  const updateTitle = (title: string) => {
    setEstimate((prev) => ({
      ...prev,
      title,
      updatedAt: new Date(),
    }));
  };

  const updateSection = (
    sectionId: string,
    updateSection: Partial<EstimateSection>
  ) => {
    setEstimate((prev) => ({
      ...prev,
      updatedAt: new Date(),
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updateSection } : section
      ),
    }));
    setEditMode(null);
  };

  const updateItem = (rowId: string, updateItem: Partial<EstimateRow>) => {
    setEstimate((prev) => ({
      ...prev,
      updatedAt: new Date(),
      sections: prev.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) =>
          row.id === rowId ? { ...row, ...updateItem } : row
        ),
      })),
    }));
    setEditMode(null);
  };

  const addSection = (title: string) => {
    const newSection: EstimateSection = {
      id: `section-${Date.now()}`,
      title,
      rows: [],
    };
    setEstimate((prev) => ({
      ...prev,
      updatedAt: new Date(),
      sections: [...prev.sections, newSection],
    }));
  };

  const addItem = (sectionId: string, item: Omit<EstimateRow, "id">) => {
    const newItem: EstimateRow = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setEstimate((prev) => ({
      ...prev,
      updatedAt: new Date(),
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, rows: [...section.rows, newItem] }
          : section
      ),
    }));
  };

  const selectItem = (item: EstimateRow) => {
    setEditMode({ type: "item", data: item });
  };

  const selectSection = (section: EstimateSection) => {
    setEditMode({ type: "section", data: section });
  };

  const clearSelection = () => {
    setEditMode(null);
  };

  const value = useMemo(
    () => ({
      estimate,
      editMode,
      updateTitle,
      updateSection,
      updateItem,
      addSection,
      addItem,
      selectItem,
      selectSection,
      clearSelection,
    }),
    [
      estimate,
      editMode,
      updateTitle,
      updateSection,
      updateItem,
      addSection,
      addItem,
      selectItem,
      selectSection,
      clearSelection,
    ]
  );

  return (
    <EstimateContext.Provider value={value}>
      {children}
    </EstimateContext.Provider>
  );
}

export function useEstimateContext() {
  const context = useContext(EstimateContext);
  if (!context) {
    throw new Error("useEstimate must be used within an EstimateProvider");
  }
  return context;
}
