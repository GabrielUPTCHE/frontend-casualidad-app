export type PaymentType = 'CASH' | 'TRANSFER';
export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED'; // Modificado según corrección de Backend

export interface PaymentDTO {
  id: string;
  orderId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus; 
  voucherUrl: string | null;
  exceptionalAuth: boolean;
  registeredBy: { id: string; name: string };
  createdAt: string; // ISO8601
  
  // Frontend Helpers (Para rellenar la tabla sin hacer populate completo desde Backend en esta vista)
  clientName?: string;
}
