import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  UserProfile,
  ServiceCategory,
  Service,
  ServiceItem,
  Address,
  Booking,
  BookingItem,
  TimeSlot,
  ServiceArea,
  BusinessHour,
  ContactMessage,
  Review,
  BookingStatus,
  IroningPricingConfig,
  SubscriptionPlan,
  CustomerSubscription,
  SubscriptionUsageRecord,
  FreeOrderReward,
  RewardRedemption,
  AuditLog,
  AdminPricingStats,
  PricingType,
  PaymentStatus,
} from '@/types/database';

interface DatabaseSchema {
  profiles: UserProfile[];
  categories: ServiceCategory[];
  services: Service[];
  service_items: ServiceItem[];
  addresses: Address[];
  bookings: Booking[];
  booking_items: BookingItem[];
  time_slots: TimeSlot[];
  service_areas: ServiceArea[];
  business_hours: BusinessHour[];
  contact_messages: ContactMessage[];
  reviews: Review[];
  ironing_config: IroningPricingConfig;
  subscription_plans: SubscriptionPlan[];
  customer_subscriptions: CustomerSubscription[];
  subscription_usage_records: SubscriptionUsageRecord[];
  free_order_rewards: FreeOrderReward[];
  reward_redemptions: RewardRedemption[];
  audit_logs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ionhub_db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'ionhub_db.json');

let memoryDb: DatabaseSchema | null = null;

const DEFAULT_IRONING_CONFIG: IroningPricingConfig = {
  price_per_pair: 25,
  pair_unit_name: 'pair of garments',
  pair_definition: 'One pair represents 2 standard garments (e.g. 1 shirt + 1 trouser or 2 formal items) as business standard.',
  free_order_threshold: 4,
  free_order_category: 'ironing',
  free_order_enabled: true,
  free_order_validity_days: 30,
  allow_combine_subscription_and_reward: false,
  worker_base_payout: 20,
  worker_payout_per_pair: 15,
  overage_price_per_garment: 15,
  updated_at: new Date().toISOString(),
};

const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub-plan-starter',
    slug: 'starter',
    name: 'Starter',
    category: 'ironing',
    monthly_price: 199,
    garment_allowance: 20,
    allowance_type: 'fixed',
    description: 'Suitable for customers with light ironing needs.',
    is_active: true,
  },
  {
    id: 'sub-plan-standard',
    slug: 'standard',
    name: 'Standard',
    category: 'ironing',
    monthly_price: 349,
    garment_allowance: 30,
    allowance_type: 'fixed',
    description: 'Suitable for regular ironing requirements.',
    is_active: true,
  },
  {
    id: 'sub-plan-premium',
    slug: 'premium',
    name: 'Premium',
    category: 'ironing',
    monthly_price: 449,
    garment_allowance: 40,
    allowance_type: 'fixed', // Administrator can configure to unlimited
    description: 'Suitable for customers with higher ironing requirements (40+ garments/month).',
    is_active: true,
  },
  {
    id: 'sub-plan-starter-foam-pass',
    slug: 'starter-foam-pass',
    name: 'Starter Foam Pass',
    category: 'car-wash',
    monthly_price: 599,
    wash_allowance: 3,
    tag: 'POPULAR',
    savings_text: 'Save ₹450 vs single bookings',
    description: '3 Washes/Month • Clean every 10 days • Quick exterior foam wash & glass shine',
    is_active: true,
  },
  {
    id: 'sub-plan-pro-sparkle-pass',
    slug: 'pro-sparkle-pass',
    name: 'Pro Sparkle Pass',
    category: 'car-wash',
    monthly_price: 999,
    wash_allowance: 5,
    tag: 'BEST VALUE IN KOMPALLY',
    savings_text: 'Save ₹750 vs single bookings',
    description: '5 Washes/Month • Weekly wash + 1 interior wipe • Doorstep service at scheduled slots',
    is_active: true,
  },
  {
    id: 'sub-plan-complete-detailing-pass',
    slug: 'complete-detailing-pass',
    name: 'Complete Detailing Pass',
    category: 'car-wash',
    monthly_price: 1399,
    wash_allowance: 5,
    interior_vacuums: 2,
    tag: 'PREMIUM CARE',
    savings_text: 'Save ₹1,100 vs single bookings',
    description: '5 Washes + 2 Interior Vacuums • Full deep clean, tire dressing & interior detailing',
    is_active: true,
  },
];

const INITIAL_DATA: DatabaseSchema = {
  profiles: [
    {
      id: 'p0000000-0000-0000-0000-000000000001',
      auth_user_id: 'auth-admin-1',
      full_name: 'ION HUB Admin',
      phone: '+91 90000 00000',
      email: 'admin@ionhub.in',
      role: 'admin',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'p0000000-0000-0000-0000-000000000002',
      auth_user_id: 'auth-customer-1',
      full_name: 'Demo Customer',
      phone: '+91 98765 43210',
      email: 'customer@ionhub.in',
      role: 'customer',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'p0000000-0000-0000-0000-000000000003',
      auth_user_id: 'auth-worker-1',
      full_name: 'Ramesh Kumar (Ironing & Car Specialist)',
      phone: '+91 91234 56789',
      email: 'worker@ionhub.in',
      role: 'worker',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      name: 'Automotive Care',
      slug: 'automotive-care',
      description: 'Eco-friendly doorstep vehicle cleaning and detailing',
      icon: 'Car',
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      name: 'Garment Care',
      slug: 'garment-care',
      description: 'Crisp, wrinkle-free clothes with doorstep pickup & delivery',
      icon: 'Shirt',
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      name: 'Home Services',
      slug: 'home-services',
      description: 'Everyday home care and deep cleaning services',
      icon: 'Home',
      is_active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  services: [
    {
      id: 's1111111-1111-1111-1111-111111111111',
      category_id: 'c1111111-1111-1111-1111-111111111111',
      name: 'Doorstep Car Wash',
      slug: 'car-wash',
      description:
        'Sparkling clean cars, happier drives. Our trained specialists arrive at your doorstep equipped with eco-friendly solutions, high-grade microfiber tools, and safe washing techniques to leave your vehicle looking brand new.',
      short_description: 'Professional eco-friendly wash, interior vacuuming & spotless finish at your home.',
      image_url: '/brand/creative_carwash.jpeg',
      duration_minutes: 60,
      price: null, // Displays "Get Quote"
      is_active: true,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 's2222222-2222-2222-2222-222222222222',
      category_id: 'c2222222-2222-2222-2222-222222222222',
      name: 'Professional Ironing',
      slug: 'ironing',
      description:
        'Zero ironing hassle. We collect your garments, give them crisp, professional pressing with temperature-controlled precision, pack them neatly, and deliver right back to your doorstep.',
      short_description: 'Steam and dry press for shirts, trousers, formal wear with pickup & delivery. ₹25 per pair.',
      image_url: '/brand/creative_ironing.jpeg',
      duration_minutes: 45,
      price: 25, // ₹25 per pair
      is_active: true,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 's3333333-3333-3333-3333-333333333333',
      category_id: 'c3333333-3333-3333-3333-333333333333',
      name: 'Home Services',
      slug: 'home-services',
      description: 'Comprehensive home care, deep cleaning, and appliance sanitization tailored for modern living.',
      short_description: 'Everyday home cleaning, kitchen & bathroom sanitization.',
      image_url: '/brand/logo_source.png',
      duration_minutes: 120,
      price: null,
      is_active: false,
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  service_items: [
    {
      id: 'si-1',
      service_id: 's1111111-1111-1111-1111-111111111111',
      name: 'Exterior Wash & Dry',
      description: 'High-pressure gentle foam rinse and streak-free microfiber dry',
      price: null,
      is_active: true,
    },
    {
      id: 'si-2',
      service_id: 's1111111-1111-1111-1111-111111111111',
      name: 'Interior Vacuuming',
      description: 'Complete vacuuming of floor mats, seats, and footwells',
      price: null,
      is_active: true,
    },
    {
      id: 'si-3',
      service_id: 's1111111-1111-1111-1111-111111111111',
      name: 'Dashboard & Trim Cleaning',
      description: 'Dust removal and gentle UV protective conditioning',
      price: null,
      is_active: true,
    },
    {
      id: 'si-4',
      service_id: 's1111111-1111-1111-1111-111111111111',
      name: 'Tire & Rim Cleaning',
      description: 'Brake dust removal and deep tire gloss finish',
      price: null,
      is_active: true,
    },
    {
      id: 'si-5',
      service_id: 's1111111-1111-1111-1111-111111111111',
      name: 'Spotless Finish',
      description: 'Microfiber glass buffing and final paint check',
      price: null,
      is_active: true,
    },
    // Ironing
    {
      id: 'si-6',
      service_id: 's2222222-2222-2222-2222-222222222222',
      name: 'Shirts',
      description: 'Crisp collars, sleeves, and wrinkle-free body press',
      price: null,
      is_active: true,
    },
    {
      id: 'si-7',
      service_id: 's2222222-2222-2222-2222-222222222222',
      name: 'Trousers & Chinos',
      description: 'Sharp center crease or flat press as preferred',
      price: null,
      is_active: true,
    },
    {
      id: 'si-8',
      service_id: 's2222222-2222-2222-2222-222222222222',
      name: 'Formal Wear & Blazers',
      description: 'Delicate temperature-controlled steaming and care',
      price: null,
      is_active: true,
    },
    {
      id: 'si-9',
      service_id: 's2222222-2222-2222-2222-222222222222',
      name: 'Other Suitable Garments',
      description: 'Kurtas, dresses, linens, and everyday wear',
      price: null,
      is_active: true,
    },
  ],
  addresses: [
    {
      id: 'addr-demo-1',
      user_id: 'p0000000-0000-0000-0000-000000000002',
      label: 'Home',
      address_line: 'Villa 42, Green Meadows, Near Cine Planet',
      area: 'Kompally',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500100',
      landmark: 'Opposite Community Hall',
      latitude: null,
      longitude: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  bookings: [
    // Pre-seed 3 completed paid ironing orders for Demo Customer so they have 3/4 progress
    {
      id: 'bk-demo-1',
      booking_reference: 'ION-IRN-101',
      user_id: 'p0000000-0000-0000-0000-000000000002',
      service_id: 's2222222-2222-2222-2222-222222222222',
      address_id: 'addr-demo-1',
      booking_date: '2026-10-01',
      time_slot: '06:00 PM - 07:00 PM',
      status: 'COMPLETED',
      customer_notes: 'Office shirts and formals',
      total_amount: 50,
      pricing_type: 'PAY_PER_ORDER',
      pairs_count: 2,
      garments_count: 4,
      unit_price: 25,
      subtotal: 50,
      discount_amount: 0,
      final_payable_amount: 50,
      payment_status: 'PAID',
      worker_id: 'p0000000-0000-0000-0000-000000000003',
      worker_name: 'Ramesh Kumar',
      worker_payout: 50,
      created_at: '2026-10-01T10:00:00.000Z',
      updated_at: '2026-10-01T19:00:00.000Z',
    },
    {
      id: 'bk-demo-2',
      booking_reference: 'ION-IRN-102',
      user_id: 'p0000000-0000-0000-0000-000000000002',
      service_id: 's2222222-2222-2222-2222-222222222222',
      address_id: 'addr-demo-1',
      booking_date: '2026-10-03',
      time_slot: '07:00 PM - 08:00 PM',
      status: 'COMPLETED',
      customer_notes: 'Trousers and shirts',
      total_amount: 75,
      pricing_type: 'PAY_PER_ORDER',
      pairs_count: 3,
      garments_count: 6,
      unit_price: 25,
      subtotal: 75,
      discount_amount: 0,
      final_payable_amount: 75,
      payment_status: 'PAID',
      worker_id: 'p0000000-0000-0000-0000-000000000003',
      worker_name: 'Ramesh Kumar',
      worker_payout: 65,
      created_at: '2026-10-03T10:00:00.000Z',
      updated_at: '2026-10-03T20:00:00.000Z',
    },
    {
      id: 'bk-demo-3',
      booking_reference: 'ION-IRN-103',
      user_id: 'p0000000-0000-0000-0000-000000000002',
      service_id: 's2222222-2222-2222-2222-222222222222',
      address_id: 'addr-demo-1',
      booking_date: '2026-10-06',
      time_slot: '08:00 PM - 09:00 PM',
      status: 'COMPLETED',
      customer_notes: 'Weekend formals',
      total_amount: 25,
      pricing_type: 'PAY_PER_ORDER',
      pairs_count: 1,
      garments_count: 2,
      unit_price: 25,
      subtotal: 25,
      discount_amount: 0,
      final_payable_amount: 25,
      payment_status: 'PAID',
      worker_id: 'p0000000-0000-0000-0000-000000000003',
      worker_name: 'Ramesh Kumar',
      worker_payout: 35,
      created_at: '2026-10-06T10:00:00.000Z',
      updated_at: '2026-10-06T21:00:00.000Z',
    },
  ],
  booking_items: [
    {
      id: 'bki-demo-1',
      booking_id: 'bk-demo-1',
      item_name: 'Shirts (2 pairs)',
      quantity: 2,
      unit_price: 25,
      created_at: '2026-10-01T10:00:00.000Z',
    },
    {
      id: 'bki-demo-2',
      booking_id: 'bk-demo-2',
      item_name: 'Trousers & Chinos (3 pairs)',
      quantity: 3,
      unit_price: 25,
      created_at: '2026-10-03T10:00:00.000Z',
    },
    {
      id: 'bki-demo-3',
      booking_id: 'bk-demo-3',
      item_name: 'Shirts (1 pair)',
      quantity: 1,
      unit_price: 25,
      created_at: '2026-10-06T10:00:00.000Z',
    },
  ],
  time_slots: [
    {
      id: 'ts-1',
      slot_time: '06:00 PM - 07:00 PM',
      capacity: 5,
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ts-2',
      slot_time: '07:00 PM - 08:00 PM',
      capacity: 5,
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ts-3',
      slot_time: '08:00 PM - 09:00 PM',
      capacity: 5,
      is_active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ts-4',
      slot_time: '09:00 PM - 10:00 PM',
      capacity: 5,
      is_active: true,
      display_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ts-5',
      slot_time: '10:00 PM - 11:00 PM',
      capacity: 5,
      is_active: true,
      display_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  service_areas: [
    {
      id: 'sa-1',
      area_name: 'Kompally',
      city: 'Hyderabad',
      pincode: '500100',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  business_hours: [
    {
      id: 'bh-1',
      day_of_week: 'Daily (Mon - Sun)',
      opening_time: '18:00',
      closing_time: '23:00',
      is_open: true,
      note: '6 PM – 11 PM (Weekends Available)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  contact_messages: [],
  reviews: [],
  ironing_config: DEFAULT_IRONING_CONFIG,
  subscription_plans: DEFAULT_SUBSCRIPTION_PLANS,
  customer_subscriptions: [],
  subscription_usage_records: [],
  free_order_rewards: [],
  reward_redemptions: [],
  audit_logs: [],
};

function readDb(): DatabaseSchema {
  try {
    let raw: string | null = null;

    // 1. Try reading from project data file (always latest on disk in local/dev)
    if (fs.existsSync(DB_FILE)) {
      try {
        raw = fs.readFileSync(DB_FILE, 'utf-8');
      } catch {}
    }

    // 2. Try reading from /tmp (persists in serverless environments)
    if (!raw && fs.existsSync(TMP_DB_FILE)) {
      try {
        raw = fs.readFileSync(TMP_DB_FILE, 'utf-8');
      } catch {}
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      const loaded: DatabaseSchema = {
        ...INITIAL_DATA,
        ...parsed,
        profiles: parsed.profiles || INITIAL_DATA.profiles,
        bookings: parsed.bookings || INITIAL_DATA.bookings,
        booking_items: parsed.booking_items || INITIAL_DATA.booking_items,
        ironing_config: parsed.ironing_config ? { ...DEFAULT_IRONING_CONFIG, ...parsed.ironing_config } : DEFAULT_IRONING_CONFIG,
        subscription_plans: (parsed.subscription_plans && parsed.subscription_plans.length > 0) ? parsed.subscription_plans : DEFAULT_SUBSCRIPTION_PLANS,
        customer_subscriptions: parsed.customer_subscriptions || [],
        subscription_usage_records: parsed.subscription_usage_records || [],
        free_order_rewards: parsed.free_order_rewards || [],
        reward_redemptions: parsed.reward_redemptions || [],
        audit_logs: parsed.audit_logs || [],
      };
      memoryDb = loaded;
      return loaded;
    }
  } catch (err) {
    console.error('Error reading local DB:', err);
  }

  if (memoryDb) {
    return memoryDb;
  }

  const fallback: DatabaseSchema = { ...INITIAL_DATA };
  memoryDb = fallback;
  return fallback;
}

function writeDb(data: DatabaseSchema): void {
  // Always update in-memory state
  memoryDb = data;

  // 1. Try writing to bundled project directory (local development)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Expected on read-only serverless filesystems (e.g., Vercel /var/task)
  }

  // 2. Write to temporary directory (/tmp is writable in serverless environments)
  try {
    fs.writeFileSync(TMP_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // In-memory state remains preserved in memoryDb
  }
}

export const localStore = {
  // Profiles
  getProfiles: () => readDb().profiles,
  getProfileById: (id: string) => readDb().profiles.find((p) => p.id === id || p.auth_user_id === id),
  getProfileByEmail: (email: string) =>
    readDb().profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()),
  createProfile: (profile: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
    const db = readDb();
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      ...profile,
      created_at: now,
      updated_at: now,
    };
    db.profiles.push(newProfile);
    writeDb(db);
    return newProfile;
  },
  updateProfile: (id: string, updates: Partial<UserProfile>) => {
    const db = readDb();
    const index = db.profiles.findIndex((p) => p.id === id || p.auth_user_id === id);
    if (index === -1) return null;
    db.profiles[index] = {
      ...db.profiles[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    writeDb(db);
    return db.profiles[index];
  },

  // Services
  getServices: () => {
    const db = readDb();
    return db.services.map((s) => ({
      ...s,
      category: db.categories.find((c) => c.id === s.category_id),
      items: db.service_items.filter((i) => i.service_id === s.id && i.is_active),
    }));
  },
  getServiceById: (id: string) => {
    const db = readDb();
    const service = db.services.find((s) => s.id === id || s.slug === id);
    if (!service) return null;
    return {
      ...service,
      category: db.categories.find((c) => c.id === service.category_id),
      items: db.service_items.filter((i) => i.service_id === service.id && i.is_active),
    };
  },
  getServiceBySlug: (slug: string) => localStore.getServiceById(slug),
  createService: (service: Omit<Service, 'created_at' | 'updated_at'> | Service) => {
    const db = readDb();
    const now = new Date().toISOString();
    const newService: Service = {
      ...service,
      created_at: (service as Service).created_at || now,
      updated_at: now,
    };
    db.services.push(newService);
    writeDb(db);
    return newService;
  },
  updateService: (id: string, updates: Partial<Service>) => {
    const db = readDb();
    const index = db.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    db.services[index] = {
      ...db.services[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    writeDb(db);
    return db.services[index];
  },

  // Service Items
  getServiceItems: (serviceId?: string) => {
    const db = readDb();
    if (serviceId) {
      return db.service_items.filter((i) => i.service_id === serviceId && i.is_active);
    }
    return db.service_items.filter((i) => i.is_active);
  },

  // Categories
  getCategories: () => readDb().categories.filter((c) => c.is_active),

  // Addresses
  getUserAddresses: (userId: string) =>
    readDb().addresses.filter((a) => a.user_id === userId),
  getAddressById: (id: string) => readDb().addresses.find((a) => a.id === id) || null,
  createAddress: (address: Omit<Address, 'id' | 'created_at' | 'updated_at'>) => {
    const db = readDb();
    const now = new Date().toISOString();
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    db.addresses.push(newAddress);
    writeDb(db);
    return newAddress;
  },
  deleteAddress: (id: string, userId: string) => {
    const db = readDb();
    db.addresses = db.addresses.filter((a) => !(a.id === id && a.user_id === userId));
    writeDb(db);
    return true;
  },

  // Time Slots & Areas
  getTimeSlots: () =>
    readDb()
      .time_slots.filter((ts) => ts.is_active)
      .sort((a, b) => a.display_order - b.display_order),
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => {
    const db = readDb();
    const idx = db.time_slots.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    db.time_slots[idx] = { ...db.time_slots[idx], ...updates, updated_at: new Date().toISOString() };
    writeDb(db);
    return db.time_slots[idx];
  },
  createTimeSlot: (slot: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => {
    const db = readDb();
    const newSlot: TimeSlot = {
      ...slot,
      id: `ts-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.time_slots.push(newSlot);
    writeDb(db);
    return newSlot;
  },
  getServiceAreas: () => readDb().service_areas.filter((sa) => sa.is_active),
  updateServiceArea: (id: string, updates: Partial<ServiceArea>) => {
    const db = readDb();
    const idx = db.service_areas.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    db.service_areas[idx] = { ...db.service_areas[idx], ...updates, updated_at: new Date().toISOString() };
    writeDb(db);
    return db.service_areas[idx];
  },
  createServiceArea: (area: Omit<ServiceArea, 'id' | 'created_at' | 'updated_at'>) => {
    const db = readDb();
    const newArea: ServiceArea = {
      ...area,
      id: `sa-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.service_areas.push(newArea);
    writeDb(db);
    return newArea;
  },

  // Business Hours
  getBusinessHours: () => readDb().business_hours,
  updateBusinessHours: (id: string, updates: Partial<BusinessHour>) => {
    const db = readDb();
    const idx = db.business_hours.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    db.business_hours[idx] = { ...db.business_hours[idx], ...updates };
    writeDb(db);
    return db.business_hours[idx];
  },

  // Bookings
  getBookings: () => {
    const db = readDb();
    return db.bookings
      .map((b) => ({
        ...b,
        service: db.services.find((s) => s.id === b.service_id),
        address: db.addresses.find((a) => a.id === b.address_id),
        user: db.profiles.find((p) => p.id === b.user_id),
        items: db.booking_items.filter((bi) => bi.booking_id === b.id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  getUserBookings: (userId: string) => {
    const db = readDb();
    return db.bookings
      .filter((b) => b.user_id === userId)
      .map((b) => ({
        ...b,
        service: db.services.find((s) => s.id === b.service_id),
        address: db.addresses.find((a) => a.id === b.address_id),
        user: db.profiles.find((p) => p.id === b.user_id),
        items: db.booking_items.filter((bi) => bi.booking_id === b.id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  getBookingById: (id: string) => {
    const db = readDb();
    const booking = db.bookings.find((b) => b.id === id || b.booking_reference === id);
    if (!booking) return null;
    return {
      ...booking,
      service: db.services.find((s) => s.id === booking.service_id),
      address: db.addresses.find((a) => a.id === booking.address_id),
      user: db.profiles.find((p) => p.id === booking.user_id),
      items: db.booking_items.filter((bi) => bi.booking_id === booking.id),
    };
  },
  createBooking: (
    booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>,
    items?: Array<{ name: string; quantity: number }>
  ) => {
    const db = readDb();
    const now = new Date().toISOString();
    const id = `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Default worker payout calculation if not set
    let workerPayout = booking.worker_payout;
    if (workerPayout === undefined || workerPayout === null) {
      workerPayout = localStore.calculateWorkerPayout({ ...booking, id } as Booking);
    }

    const newBooking: Booking = {
      ...booking,
      id,
      worker_payout: workerPayout,
      payment_status: booking.payment_status || (booking.final_payable_amount === 0 ? 'PAID' : 'PAID'),
      created_at: now,
      updated_at: now,
    };
    db.bookings.push(newBooking);

    if (items && items.length > 0) {
      items.forEach((item, index) => {
        db.booking_items.push({
          id: `bki-${id}-${index}`,
          booking_id: id,
          item_name: item.name,
          quantity: item.quantity,
          unit_price: null,
          created_at: now,
        });
      });
    }

    writeDb(db);

    // Audit log
    localStore.addAuditLog({
      user_id: booking.user_id,
      action: 'BOOKING_CREATED',
      entity_type: 'booking',
      entity_id: id,
      details: {
        booking_reference: booking.booking_reference,
        pricing_type: booking.pricing_type,
        pairs_count: booking.pairs_count,
        final_payable_amount: booking.final_payable_amount,
        reward_applied: booking.reward_id_applied,
        subscription_applied: booking.subscription_id_applied,
      },
    });

    const found = localStore.getBookingById(id);
    if (found) return found;

    return {
      ...newBooking,
      service: db.services.find((s) => s.id === newBooking.service_id),
      address: db.addresses.find((a) => a.id === newBooking.address_id),
      user: db.profiles.find((p) => p.id === newBooking.user_id),
      items: db.booking_items.filter((bi) => bi.booking_id === id),
    };
  },
  updateBookingStatus: (id: string, status: BookingStatus) => {
    const db = readDb();
    const index = db.bookings.findIndex((b) => b.id === id || b.booking_reference === id);
    if (index === -1) return null;
    
    const prevStatus = db.bookings[index].status;
    db.bookings[index].status = status;
    db.bookings[index].updated_at = new Date().toISOString();
    const booking = db.bookings[index];
    writeDb(db);

    // If order was cancelled and had used subscription, restore allowance
    if (status === 'CANCELLED' && prevStatus !== 'CANCELLED' && booking.subscription_id_applied) {
      localStore.restoreSubscriptionUsage(booking.id);
    }

    // If order completed and paid, check if customer qualifies for loyalty reward
    if (status === 'COMPLETED' && prevStatus !== 'COMPLETED') {
      localStore.checkAndAwardLoyaltyReward(booking.user_id);
    }

    localStore.addAuditLog({
      user_id: booking.user_id,
      action: 'BOOKING_STATUS_CHANGED',
      entity_type: 'booking',
      entity_id: booking.id,
      details: { from: prevStatus, to: status },
    });

    return localStore.getBookingById(id);
  },

  // ==============================================================================
  // IRONING PRICING & PROMOTIONS CONFIGURATION
  // ==============================================================================
  getIroningConfig: (): IroningPricingConfig => {
    const db = readDb();
    return db.ironing_config || DEFAULT_IRONING_CONFIG;
  },
  updateIroningConfig: (updates: Partial<IroningPricingConfig>): IroningPricingConfig => {
    const db = readDb();
    db.ironing_config = {
      ...(db.ironing_config || DEFAULT_IRONING_CONFIG),
      ...updates,
      updated_at: new Date().toISOString(),
    };
    writeDb(db);

    localStore.addAuditLog({
      action: 'IRONING_CONFIG_UPDATED',
      entity_type: 'config',
      entity_id: 'ironing_config',
      details: updates as Record<string, unknown>,
    });

    return db.ironing_config;
  },

  // ==============================================================================
  // MONTHLY SUBSCRIPTION PLANS & MANAGEMENT
  // ==============================================================================
  getSubscriptionPlans: (): SubscriptionPlan[] => {
    const db = readDb();
    return db.subscription_plans || DEFAULT_SUBSCRIPTION_PLANS;
  },
  updateSubscriptionPlan: (id: string, updates: Partial<SubscriptionPlan>): SubscriptionPlan | null => {
    const db = readDb();
    const idx = db.subscription_plans.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return null;
    db.subscription_plans[idx] = {
      ...db.subscription_plans[idx],
      ...updates,
    };
    writeDb(db);

    localStore.addAuditLog({
      action: 'SUBSCRIPTION_PLAN_UPDATED',
      entity_type: 'subscription_plan',
      entity_id: id,
      details: updates as Record<string, unknown>,
    });

    return db.subscription_plans[idx];
  },

  getUserActiveSubscription: (userId: string): CustomerSubscription | null => {
    const db = readDb();
    const now = new Date();
    const active = db.customer_subscriptions.find((sub) => {
      if (sub.user_id !== userId || sub.status !== 'ACTIVE') return false;
      const renewal = new Date(sub.renewal_date);
      return renewal > now;
    });
    return active || null;
  },

  getUserSubscriptions: (userId: string): CustomerSubscription[] => {
    const db = readDb();
    return db.customer_subscriptions
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createSubscription: (
    data: Omit<CustomerSubscription, 'id' | 'created_at' | 'updated_at'>
  ): CustomerSubscription => {
    const db = readDb();
    const now = new Date();
    const renewal = new Date(now);
    renewal.setMonth(renewal.getMonth() + 1);

    // Cancel any previous active subscription for this user
    db.customer_subscriptions.forEach((s) => {
      if (s.user_id === data.user_id && s.status === 'ACTIVE') {
        s.status = 'CANCELLED';
        s.updated_at = now.toISOString();
      }
    });

    const newSub: CustomerSubscription = {
      ...data,
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      start_date: data.start_date || now.toISOString(),
      renewal_date: data.renewal_date || renewal.toISOString(),
      status: 'ACTIVE',
      payment_status: 'PAID',
      auto_renew: false, // Default false unless recurrent authorization configured
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    db.customer_subscriptions.push(newSub);
    writeDb(db);

    localStore.addAuditLog({
      user_id: data.user_id,
      action: 'SUBSCRIPTION_ACTIVATED',
      entity_type: 'subscription',
      entity_id: newSub.id,
      details: {
        plan_name: newSub.plan_name,
        monthly_price: newSub.monthly_price,
        included_garments: newSub.included_garments,
      },
    });

    return newSub;
  },

  cancelSubscription: (subscriptionId: string, userId: string): boolean => {
    const db = readDb();
    const sub = db.customer_subscriptions.find((s) => s.id === subscriptionId && s.user_id === userId);
    if (!sub) return false;
    sub.status = 'CANCELLED';
    sub.updated_at = new Date().toISOString();
    writeDb(db);

    localStore.addAuditLog({
      user_id: userId,
      action: 'SUBSCRIPTION_CANCELLED',
      entity_type: 'subscription',
      entity_id: subscriptionId,
      details: { plan_name: sub.plan_name },
    });

    return true;
  },

  recordSubscriptionUsage: (
    subscriptionId: string,
    bookingId: string,
    bookingReference: string,
    garmentsCount: number,
    notes?: string
  ): boolean => {
    const db = readDb();
    const sub = db.customer_subscriptions.find((s) => s.id === subscriptionId && s.status === 'ACTIVE');
    if (!sub) return false;

    // Check if this booking has already deducted garments
    const existingUsage = db.subscription_usage_records.find(
      (r) => r.subscription_id === subscriptionId && r.booking_id === bookingId
    );
    if (existingUsage) {
      return false; // Prevent double deduction
    }

    const deducted = Math.min(garmentsCount, sub.garments_remaining);
    sub.garments_used += deducted;
    sub.garments_remaining = Math.max(0, sub.included_garments - sub.garments_used);
    sub.updated_at = new Date().toISOString();

    const record: SubscriptionUsageRecord = {
      id: `sur-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      subscription_id: subscriptionId,
      user_id: sub.user_id,
      booking_id: bookingId,
      booking_reference: bookingReference,
      garments_deducted: deducted,
      notes: notes || `Deducted ${deducted} garments for booking ${bookingReference}`,
      created_at: new Date().toISOString(),
    };

    db.subscription_usage_records.push(record);
    writeDb(db);

    return true;
  },

  restoreSubscriptionUsage: (bookingId: string): boolean => {
    const db = readDb();
    const recordIndex = db.subscription_usage_records.findIndex((r) => r.booking_id === bookingId);
    if (recordIndex === -1) return false;

    const record = db.subscription_usage_records[recordIndex];
    const sub = db.customer_subscriptions.find((s) => s.id === record.subscription_id);
    if (sub) {
      sub.garments_used = Math.max(0, sub.garments_used - record.garments_deducted);
      sub.garments_remaining = Math.min(sub.included_garments, sub.garments_remaining + record.garments_deducted);
      sub.updated_at = new Date().toISOString();
    }

    // Remove the record
    db.subscription_usage_records.splice(recordIndex, 1);
    writeDb(db);
    return true;
  },

  getSubscriptionUsageHistory: (subscriptionId: string): SubscriptionUsageRecord[] => {
    const db = readDb();
    return db.subscription_usage_records
      .filter((r) => r.subscription_id === subscriptionId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // ==============================================================================
  // PROMOTIONAL OFFER: EVERY 5TH ORDER FREE (LOYALTY)
  // ==============================================================================
  getUserLoyaltyProgress: (userId: string) => {
    const db = readDb();
    const config = db.ironing_config || DEFAULT_IRONING_CONFIG;
    const threshold = config.free_order_threshold || 4;

    // Filter eligible completed paid ironing orders
    // Eligible criteria:
    // 1. Service is ironing
    // 2. Status is COMPLETED
    // 3. Payment status is PAID
    // 4. Paid amount > 0 (not a 100% free redeemed order, unless admin explicitly permits)
    const eligibleOrders = db.bookings.filter((b) => {
      if (b.user_id !== userId) return false;
      if (b.status !== 'COMPLETED') return false;
      if (b.payment_status !== 'PAID') return false;

      // Service check: is ironing service
      const isIroning =
        b.service_id === 's2222222-2222-2222-2222-222222222222' ||
        b.service?.slug === 'ironing' ||
        b.pricing_type === 'PAY_PER_ORDER' ||
        (b.pairs_count !== undefined && b.pairs_count !== null && b.pairs_count > 0);

      if (!isIroning) return false;

      // Paid check: must be a paid order (not a completely free redeemed order)
      const isPaid = (b.final_payable_amount || b.total_amount || 0) > 0;
      return isPaid;
    });

    const totalEligiblePaidCount = eligibleOrders.length;

    // Available unredeemed and unexpired rewards
    const now = new Date();
    const userRewards = db.free_order_rewards.filter((r) => r.user_id === userId);
    const availableReward = userRewards.find(
      (r) => r.status === 'AVAILABLE' && new Date(r.expires_at) > now
    ) || null;

    // Redemptions
    const redemptions = db.reward_redemptions.filter((r) => r.user_id === userId);

    // Current cycle progress (e.g., 3 out of 4)
    // Every 4 completed orders unlocks a free order
    const completedInCurrentCycle = totalEligiblePaidCount % threshold;
    const ordersNeededForNextReward =
      completedInCurrentCycle === 0 && totalEligiblePaidCount > 0 && !availableReward
        ? threshold
        : threshold - completedInCurrentCycle;

    return {
      totalEligiblePaidCount,
      completedInCurrentCycle,
      requiredForFree: threshold,
      ordersNeeded: ordersNeededForNextReward,
      isRewardAvailable: Boolean(availableReward),
      currentReward: availableReward,
      userRewards,
      redemptions,
      eligibleOrders,
    };
  },

  checkAndAwardLoyaltyReward: (userId: string): FreeOrderReward | null => {
    const db = readDb();
    const config = db.ironing_config || DEFAULT_IRONING_CONFIG;
    if (!config.free_order_enabled) return null;

    const threshold = config.free_order_threshold || 4;
    const progress = localStore.getUserLoyaltyProgress(userId);

    // Number of rewards user is entitled to earn based on total eligible orders
    const totalEntitledRewards = Math.floor(progress.totalEligiblePaidCount / threshold);
    const userRewards = db.free_order_rewards.filter((r) => r.user_id === userId);

    if (totalEntitledRewards > userRewards.length) {
      // Award new reward!
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + (config.free_order_validity_days || 30));

      const reward: FreeOrderReward = {
        id: `rew-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: userId,
        reward_code: `FREE-5TH-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'AVAILABLE',
        earned_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        qualifying_order_count: threshold,
      };

      db.free_order_rewards.push(reward);
      writeDb(db);

      localStore.addAuditLog({
        user_id: userId,
        action: 'LOYALTY_REWARD_EARNED',
        entity_type: 'reward',
        entity_id: reward.id,
        details: {
          code: reward.reward_code,
          eligibleOrdersCount: progress.totalEligiblePaidCount,
        },
      });

      return reward;
    }

    return null;
  },

  redeemFreeOrderReward: (
    rewardId: string,
    bookingId: string,
    bookingReference: string,
    discountAmount: number
  ): boolean => {
    const db = readDb();
    const now = new Date();
    const rewardIndex = db.free_order_rewards.findIndex((r) => r.id === rewardId);

    if (rewardIndex === -1) return false;
    const reward = db.free_order_rewards[rewardIndex];

    // Atomic validation: must be AVAILABLE and not expired
    if (reward.status !== 'AVAILABLE' || new Date(reward.expires_at) <= now) {
      return false;
    }

    // Check if reward was already recorded in redemptions
    const existingRedemption = db.reward_redemptions.find((r) => r.reward_id === rewardId);
    if (existingRedemption) {
      return false;
    }

    // Mark reward as redeemed
    reward.status = 'REDEEMED';
    reward.redeemed_at = now.toISOString();
    reward.redeemed_booking_id = bookingId;

    const redemption: RewardRedemption = {
      id: `red-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reward_id: rewardId,
      user_id: reward.user_id,
      booking_id: bookingId,
      booking_reference: bookingReference,
      discount_amount: discountAmount,
      redeemed_at: now.toISOString(),
    };

    db.reward_redemptions.push(redemption);
    writeDb(db);

    localStore.addAuditLog({
      user_id: reward.user_id,
      action: 'LOYALTY_REWARD_REDEEMED',
      entity_type: 'reward',
      entity_id: rewardId,
      details: {
        bookingReference,
        discountAmount,
      },
    });

    return true;
  },

  // ==============================================================================
  // WORKER INTEGRATION & PAYOUT MODEL
  // ==============================================================================
  calculateWorkerPayout: (booking: Booking): number => {
    const db = readDb();
    const config = db.ironing_config || DEFAULT_IRONING_CONFIG;

    // Check if car wash
    if (booking.service_id === 's1111111-1111-1111-1111-111111111111' || booking.service?.slug === 'car-wash') {
      return 250; // Standard car wash specialist payout
    }

    // Ironing payout model:
    // Base fee + per-pair fee
    const base = config.worker_base_payout || 20;
    const perPair = config.worker_payout_per_pair || 15;

    let pairs = booking.pairs_count || 0;
    if (!pairs && booking.garments_count) {
      pairs = Math.ceil(booking.garments_count / 2);
    }
    if (pairs <= 0) pairs = 1;

    // Notice: worker payout is calculated from the physical work (pairs),
    // NOT from customer discounted payment! Free order promo does NOT penalize worker!
    return base + pairs * perPair;
  },

  getWorkerBookings: (workerId?: string) => {
    const db = readDb();
    return db.bookings
      .filter((b) => !workerId || b.worker_id === workerId || !b.worker_id)
      .map((b) => ({
        ...b,
        service: db.services.find((s) => s.id === b.service_id),
        address: db.addresses.find((a) => a.id === b.address_id),
        user: db.profiles.find((p) => p.id === b.user_id),
        items: db.booking_items.filter((bi) => bi.booking_id === b.id),
        worker_payout: b.worker_payout || localStore.calculateWorkerPayout(b),
      }))
      .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
  },

  assignWorkerToBooking: (bookingId: string, workerId: string, workerName?: string) => {
    const db = readDb();
    const idx = db.bookings.findIndex((b) => b.id === bookingId || b.booking_reference === bookingId);
    if (idx === -1) return null;

    db.bookings[idx].worker_id = workerId;
    if (workerName) {
      db.bookings[idx].worker_name = workerName;
    } else {
      const workerProfile = db.profiles.find((p) => p.id === workerId);
      db.bookings[idx].worker_name = workerProfile?.full_name || 'Assigned Specialist';
    }
    db.bookings[idx].updated_at = new Date().toISOString();
    writeDb(db);
    return db.bookings[idx];
  },

  // ==============================================================================
  // ADMIN PRICING STATS & AUDIT LOGS
  // ==============================================================================
  getAdminPricingStats: (): AdminPricingStats => {
    const db = readDb();
    const activeSubs = db.customer_subscriptions.filter((s) => s.status === 'ACTIVE');

    const starterSubs = activeSubs.filter((s) => s.plan_slug === 'starter').length;
    const standardSubs = activeSubs.filter((s) => s.plan_slug === 'standard').length;
    const premiumSubs = activeSubs.filter((s) => s.plan_slug === 'premium').length;

    const monthlySubscriptionRevenue = activeSubs.reduce((acc, curr) => acc + (curr.monthly_price || 0), 0);

    const totalFreeRewardsEarned = db.free_order_rewards.length;
    const totalFreeRewardsRedeemed = db.reward_redemptions.length;

    const ironingBookings = db.bookings.filter(
      (b) =>
        b.service_id === 's2222222-2222-2222-2222-222222222222' ||
        b.service?.slug === 'ironing' ||
        b.pricing_type === 'PAY_PER_ORDER' ||
        b.pricing_type === 'SUBSCRIPTION'
    );

    const totalIroningOrders = ironingBookings.length;
    const ironingOrderRevenue = ironingBookings.reduce(
      (acc, curr) => acc + (curr.final_payable_amount ?? curr.total_amount ?? 0),
      0
    );

    const totalGarmentsUsedInSubscriptions = db.subscription_usage_records.reduce(
      (acc, curr) => acc + curr.garments_deducted,
      0
    );

    const totalGarmentsRemainingInSubscriptions = activeSubs.reduce(
      (acc, curr) => acc + curr.garments_remaining,
      0
    );

    const refundsAndFailedCount = db.bookings.filter(
      (b) => b.payment_status === 'FAILED' || b.payment_status === 'REFUNDED'
    ).length;

    return {
      activeSubscribersByPlan: {
        starter: starterSubs,
        standard: standardSubs,
        premium: premiumSubs,
        total: activeSubs.length,
      },
      monthlySubscriptionRevenue,
      totalFreeRewardsEarned,
      totalFreeRewardsRedeemed,
      totalIroningOrders,
      ironingOrderRevenue,
      totalGarmentsUsedInSubscriptions,
      totalGarmentsRemainingInSubscriptions,
      refundsAndFailedCount,
    };
  },

  addAuditLog: (entry: Omit<AuditLog, 'id' | 'created_at'>): AuditLog => {
    const db = readDb();
    const log: AuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };
    db.audit_logs.push(log);
    writeDb(db);
    return log;
  },

  getAuditLogs: (limit = 50): AuditLog[] => {
    const db = readDb();
    return db.audit_logs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  // Contact Messages
  createContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => {
    const db = readDb();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...msg,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    db.contact_messages.push(newMsg);
    writeDb(db);
    return newMsg;
  },
  getContactMessages: () => {
    const db = readDb();
    return db.contact_messages.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
  updateContactMessageStatus: (id: string, status: 'unread' | 'read' | 'replied') => {
    const db = readDb();
    const idx = db.contact_messages.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    db.contact_messages[idx].status = status;
    writeDb(db);
    return db.contact_messages[idx];
  },
};
