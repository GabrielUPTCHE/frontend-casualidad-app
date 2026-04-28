import { OrderClientDTO } from './client.dto';

export type OrderStatus = 'PENDING_ACCEPTANCE' | 'PENDING_PAYMENT' | 'EN_PRODUCCION' | 'IN_PRODUCTION' | 'DONE' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export interface OrderProductDTO {
  idDetalle: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrderSummaryDTO {
  idPedido: number;
  codigoUnico: string;
  estadoPedido: OrderStatus;
  fechaEntrega: string;
  total: number | null;
  saldoPendiente: number | null;
  cliente: OrderClientDTO;
  
  // Legacy fields for UI compatibility
  id: string;
  code: string | null;
  clientName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  pendingBalance: number;
  deliveryDate: string;
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
  productos: OrderProductDTO[];
  // Legacy fields
  client?: any;
  items?: OrderItemDTO[];
  paymentsHistory?: any[];
}
