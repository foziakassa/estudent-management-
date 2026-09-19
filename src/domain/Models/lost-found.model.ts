export type LostFoundItemType = "LOST" | "FOUND";

export type LostFoundCategory =
  | "BAGS"
  | "ELECTRONICS"
  | "CLOTHING"
  | "BOOKS"
  | "KEYS"
  | "DOCUMENTS"
  | "OTHER"
  | string;

export type LostFoundStatus = "PENDING" | "CLAIMED" | "RESOLVED" | string;

export interface LostFoundItem {
  id: number;
  reporter_id: number;
  item_type: LostFoundItemType;
  item_name: string;
  category: LostFoundCategory;
  description: string;
  location: string;
  date_reported: string;
  status: LostFoundStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateLostFoundPayload {
  category: LostFoundCategory;
  description: string;
  item_name: string;
  item_type: LostFoundItemType;
  location: string;
}

export interface LostFoundListData {
  data: LostFoundItem[];
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
