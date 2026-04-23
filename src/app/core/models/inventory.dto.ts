export interface UnitDTO {
  id: string;
  name: string;
}

export type ProductType = 'INSUMO' | 'ELABORADO' | 'TRANSFORMADO' | 'REVENTA';

export interface CompositionItem {
  inventoryId: string;
  name: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface ProductDTO {
  id: string;
  name: string;
  type: ProductType;
  unit: UnitDTO;
  stock: number;
  minStock: number;
  purchasePrice: number | null;
  salePrice: number | null;
  wastePercent: number | null;
  productionCost: number | null;
  isLowStock: boolean;
  composition: CompositionItem[] | null;
}
