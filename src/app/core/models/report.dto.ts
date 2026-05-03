// DTO para la sección de Conciliación de Ingresos
export interface IncomeDetail {
  orderId: string;
  clientName: string;
  amount: number;
  type: 'CASH' | 'TRANSFER';
  date: string; // ISO8601
}

export interface IncomeReportDTO {
  dateFrom: string; // ISO8601 date
  dateTo: string;   // ISO8601 date
  totalIncome: number;
  cashTotal: number;
  transferTotal: number;
  breakdown: IncomeDetail[];
}

// DTO para la tabla de Saldos por Cobrar
export interface PendingBalanceDTO {
  orderId: string;
  orderCode: string;
  clientName: string;
  deliveryDate: string; // ISO8601 date
  totalAmount: number;
  pendingBalance: number;
  daysUntilDelivery: number;
}

// DTO para el Ranking de Productos
export interface TopProductDTO {
  rank: number;
  productId: string;
  productName: string;
  categoryName: string | null;
  unitsSold: number;
  totalRevenue: number;
}
