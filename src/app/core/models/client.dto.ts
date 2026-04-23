export interface ClientDTO {
  id: string;
  name: string;
  phones: string[];
  address: string | null;
  isActive: boolean;
  ordersSummary: {
    total: number;
    pending: number;
    inProduction: number;
  };
  createdAt: string;
}
