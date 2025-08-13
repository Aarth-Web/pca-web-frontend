export interface Shop {
  _id: string;
  name: string;
  slug: string;
  address: string;
  ownerEmail: string;
  ownerPhone: string;
  upiId: string;
  qrCodeImageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopStats {
  totalShops: number;
  activeShops: number;
  inactiveShops: number;
  newShopsThisMonth: number;
  shopGrowthRate: number;
}

export interface SuperAdminDashboardStats {
  shopStats: ShopStats;
  recentShops: Shop[];
}

export interface ShopsListResponse {
  shops: Shop[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface ShopFormData {
  name: string;
  address: string;
  ownerPhone: string;
  ownerPassword?: string;
  ownerEmail: string;
  upiId: string;
  qrCodeImageUrl?: string;
  isActive?: boolean;
}
