/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserRole {
  AGENT = "agent",
  CUSTOMER = "customer",
  VENDOR = "vendor",
}

export enum AgentVerificationStatus {
  PENDING = "Pending",
  VERIFIED = "Verified",
  FAILED = "Failed",
}

export enum OrderStatus {
  PENDING = "Pending",
  DELIVERED = "Delivered",
  REJECTED = "Rejected",
  IN_TRANSIT = "In_Transit",
  CANCELLED = "cancelled",
}
export enum VerificationDocument {
  DRIVERS_LICENSE = 'driversLicense',
  NIN_SLIP = 'ninSlip',
  NATIONAL_ID = 'nationalId'

}
export enum DeliveryStatus {
  ASSIGNED = "Assigned",
  AVAILABLE = "Available",
  IN_TRANSIT = "In Transit",
  UNAVAILABLE = "Un Available",
  DELIVERED = "Delivered",
}

export interface Location {
  lat: number;
  lng: number;
}

export enum PaymentStatus {
  PAID = "Paid",
  FAILED = "Failed",
  PENDING = "Pending",
  CANCELLED = "Cancelled",
}

export interface AgentReview {
  id: string;
  rating: number;
  comment: string;
  customerId: string;
  timestamp: string;
}
export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProductReview {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  image: string;
  videoURL?: string;
  reviews: ProductReview[];
}

export interface DeliveryAgent {
  id: string;
  isVerified: boolean;
  documentURL: string;
  AgentverificationStatus: AgentVerificationStatus;

  reviews: AgentReview[];
  reviewCount: number;
  totalScore: number;

  fraudReports: number;
  negligenceReports: number;
  deliveryOrders: Order[];

  status: DeliveryStatus;

  updateDeliveryStatus: (status: DeliveryStatus) => void;
  updateVerficationStatus: (status: boolean) => void;
  updateTotalScore: (score: number) => void;

  updateFraudReportCount: (count: number) => void;
  updateNegligenceReportCount: (count: number) => void;

  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (fileId: string) => Promise<void>;
  reportAgent: (reportType: "fraud" | "negligence") => void;
  resetState: () => void;
}

export interface Order {
  id: string;
  buyerId: string;
  productDetails: Product[];
  deliveryAddress: DeliveryAddress;
  deliveryFormat: string;
  totalPrice: number;
  orderDate: string;
  paymentStatus: PaymentStatus;
  agent: DeliveryAgent;

  tracking: {
    status: OrderStatus;
    currentLocation: Location;
    estimatedDeliveryTime: string; // ISO format
  };

  updateStatus: (status: OrderStatus) => void;
  updateEstimatedDeliveryTime: (time: string) => void;
  updateCurrentLocation: () => void;
  updatePaymentStatus: (status: PaymentStatus) => void;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  phone: string;
  currentRole: UserRole;
  roleChangeTimestamp: string;
  currentLocation: Location;
  error: string | null;

  setRole: (role: UserRole) => void;
  setLocation: (lat: number, lng: number) => void;
  fetchUserDetails: () => void;
  orders: Order[];
  activeOrders: Order[];
  nearByAgents: DeliveryAgent[];
  agent: DeliveryAgent;

  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;

  fetchNearByAgents: () => void;

  setError: (error: string | null) => void;
  resetState: () => void;
}

export interface VendorState {
  vendorId: string;
  businessName: string;
  businessBanner:string;
  openHours: string;
  merchantName: string;
  category: string;
  loading: boolean;
  error: string | null;
  currentLocation: Location;
  isUploadingVideo: boolean;
  videoUploadProgress: number;
  catalog: Product[];
  orders: Order[];
  activeOrders: Order[];
  nearByAgents: DeliveryAgent[];

  setCatalog: (catalog: Product[]) => void;
  addProductToCatalog: (product: Product) => void;
  uploadVideo: (productId: string, videoUrl: string) => Promise<void>;
  deleteVideo: (productId: string, videoId: string) => Promise<void>;
  removeProductFromCatalog: (productId: string) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setActiveOrders: (activeOrders: Order[]) => void;
  fetchOrders: () => void;
  fetchCatalog: () => void;
  fetchNearByAgents: (maxDistance: number) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}
export interface GlobalState {
  currentUser: {
    role: UserRole | null;
    profile: UserState | VendorState | DeliveryAgent | null;
  };
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  updateProfile: (
    data: Partial<UserState | VendorState | DeliveryAgent>
  ) => Promise<void>;
  resetState: () => void;
}

export type Vendor = Partial<VendorState>;
export type User = Partial<UserState>;

export interface BestSellingBites {
  productId: string;
  name: string;
  price: number;
  rating: number;
  vendor: Vendor;
  orderCount: number;
}

export interface HotAndFreshFavorites {
  productId: string;
  name: string;
  price: number;
  rating: number;
  vendor: Vendor;
  orderCount: number;
}

export interface TopCravings {
  productId: string;
  name: string;
  price: number;
  rating: number;
  vendor: Vendor;
  orderCount: number;
}

export type ErrorCodeMapping = Record<string, string>;

export type ParsedError = {
  userMessage: string;
  developerMessage?: string;
  originalError?: any;
  timestamp?: string;
};
