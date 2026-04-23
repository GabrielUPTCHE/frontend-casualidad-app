import { ClientDTO } from './client.dto';

export type OrderStatus = 'PENDING_ACCEPTANCE' | 'PENDING_PAYMENT' | 'IN_PRODUCTION' | 'DONE' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export interface OrderSummaryDTO {
  id: string;
  code: string | null;
  clientName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  pendingBalance: number;
  deliveryDate: string; // ISO8601 date
}

export interface OrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customization: string | null;
}

export interface OrderDetailDTO extends OrderSummaryDTO {
  client: ClientDTO;
  items: OrderItemDTO[];
  paymentsHistory: any[]; // Se definirá PaymentDTO a detalle después si es necesario
}
