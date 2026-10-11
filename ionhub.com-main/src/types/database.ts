// ==============================================================================
// ION HUB - TYPE DEFINITIONS
// ==============================================================================

export type UserRole = 'customer' | 'admin' | 'worker';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_SERVICE'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  phone: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string | null;
  icon?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  image_url: string;
  duration_minutes?: number | null;
  price?: number | null; // Nullable -> displays "Get Quote"
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  items?: ServiceItem[];
  category?: ServiceCategory;
}

export interface ServiceItem {
  id: string;
  service_id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  is_active: boolean;
  created_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string; // 'Home', 'Office', 'Other'
  address_line: string;
  area: string; // 'Kompally'
  city: string; // 'Hyderabad'
  state: string; // 'Telangana'
  pincode: string; // '500100'
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
}

export type PricingType = 'PAY_PER_ORDER' | 'SUBSCRIPTION';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface Booking {
  id: string;
  booking_reference: string;
  user_id: string;
  service_id: string;
  address_id: string;
  booking_date: string; // YYYY-MM-DD
  time_slot: string;
  status: BookingStatus;
  customer_notes?: string | null;
  total_amount?: number | null;
  created_at: string;
  updated_at: string;

  // Ironing Pricing & Subscription Details
  pricing_type?: PricingType;
  pairs_count?: number | null;
  garments_count?: number | null;
  unit_price?: number | null;
  subtotal?: number | null;
  discount_amount?: number | null;
  reward_id_applied?: string | null;
  subscription_id_applied?: string | null;
  overage_garments?: number | null;
  overage_charge?: number | null;
  final_payable_amount?: number | null;
  payment_status?: PaymentStatus;

  // Worker Allocation & Payout
  worker_id?: string | null;
  worker_name?: string | null;
  worker_payout?: number | null;

  // Joins
  service?: Service;
  address?: Address;
  user?: UserProfile;
  items?: BookingItem[];
}

export interface BookingItem {
  id: string;
  booking_id: string;
  service_item_id?: string | null;
  item_name: string;
  quantity: number;
  unit_price?: number | null;
  notes?: string | null;
  created_at?: string;
}

export interface TimeSlot {
  id: string;
  slot_time: string;
  capacity: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id: string;
  area_name: string;
  city: string;
  pincode: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessHour {
  id: string;
  day_of_week: string;
  opening_time: string;
  closing_time: string;
  is_open: boolean;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  user?: UserProfile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

// ==============================================================================
// IRONING PRICING, PROMOTIONS & SUBSCRIPTIONS
// ==============================================================================

export interface IroningPricingConfig {
  price_per_pair: number; // default: 25
  pair_unit_name: string; // e.g., "pair of garments"
  pair_definition: string; // business definition of what constitutes a pair
  free_order_threshold: number; // default: 4 (every 5th free)
  free_order_category: string; // default: "ironing"
  free_order_enabled: boolean; // default: true
  free_order_validity_days: number; // default: 30
  allow_combine_subscription_and_reward: boolean; // default: false
  worker_base_payout: number; // default: 20
  worker_payout_per_pair: number; // default: 15
  overage_price_per_garment: number; // default: 15
  updated_at: string;
}

export type SubscriptionPlanSlug =
  | 'starter'
  | 'standard'
  | 'premium'
  | 'starter-foam-pass'
  | 'pro-sparkle-pass'
  | 'complete-detailing-pass';

export interface SubscriptionPlan {
  id: string;
  slug: SubscriptionPlanSlug;
  name: string;
  category?: 'ironing' | 'car-wash';
  monthly_price: number;
  garment_allowance?: number; // 20, 30, 40+ for ironing
  wash_allowance?: number; // for car wash (3, 5, etc.)
  interior_vacuums?: number; // for car wash complete detailing
  allowance_type?: 'fixed' | 'unlimited'; // Configurable for Premium: fixed or unlimited
  tag?: string; // e.g., 'BEST VALUE IN KOMPALLY'
  savings_text?: string; // e.g., 'Save ₹750 vs single bookings'
  description: string;
  is_active: boolean;
}

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAYMENT_PENDING';

export interface CustomerSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_slug: SubscriptionPlanSlug;
  plan_name: string;
  monthly_price: number;
  included_garments: number;
  garments_used: number;
  garments_remaining: number;
  status: SubscriptionStatus;
  start_date: string; // ISO
  renewal_date: string; // ISO (1 month)
  payment_status: PaymentStatus;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsageRecord {
  id: string;
  subscription_id: string;
  user_id: string;
  booking_id: string;
  booking_reference: string;
  garments_deducted: number;
  notes?: string;
  created_at: string;
}

export type RewardStatus = 'AVAILABLE' | 'REDEEMED' | 'EXPIRED';

export interface FreeOrderReward {
  id: string;
  user_id: string;
  reward_code: string;
  status: RewardStatus;
  earned_at: string;
  expires_at: string;
  redeemed_at?: string | null;
  redeemed_booking_id?: string | null;
  qualifying_order_count: number;
}

export interface RewardRedemption {
  id: string;
  reward_id: string;
  user_id: string;
  booking_id: string;
  booking_reference: string;
  discount_amount: number;
  redeemed_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminPricingStats {
  activeSubscribersByPlan: {
    starter: number;
    standard: number;
    premium: number;
    total: number;
  };
  monthlySubscriptionRevenue: number;
  totalFreeRewardsEarned: number;
  totalFreeRewardsRedeemed: number;
  totalIroningOrders: number;
  ironingOrderRevenue: number;
  totalGarmentsUsedInSubscriptions: number;
  totalGarmentsRemainingInSubscriptions: number;
  refundsAndFailedCount: number;
}
