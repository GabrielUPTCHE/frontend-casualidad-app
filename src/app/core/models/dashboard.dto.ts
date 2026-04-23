export interface DashboardDTO {
  pendingOrders: number;
  ordersWithDebt: number;
  profitVsExpense: {
    months: string[];
    profit: number[];
    expense: number[];
  };
  lowStockCount: number;
}
