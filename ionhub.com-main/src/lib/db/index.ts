import { localStore } from './local-store';
import { createServerSupabaseClient, createAdminSupabaseClient } from '../supabase/server';
import {
  UserProfile,
  Service,
  Address,
  Booking,
  TimeSlot,
  ServiceArea,
  BusinessHour,
  ContactMessage,
  BookingStatus,
  IroningPricingConfig,
  SubscriptionPlan,
  CustomerSubscription,
  SubscriptionUsageRecord,
  FreeOrderReward,
  RewardRedemption,
  AuditLog,
  AdminPricingStats,
} from '@/types/database';

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const db = {
  // Profiles
  async getProfileById(id: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`id.eq.${id},auth_user_id.eq.${id}`)
          .single();
        if (!error && data) return data as UserProfile;
      }
    }
    return localStore.getProfileById(id) || null;
  },

  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', email)
          .single();
        if (!error && data) return data as UserProfile;
      }
    }
    return localStore.getProfileByEmail(email) || null;
  },

  async createProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const isRealAuthId = profile.auth_user_id && UUID_REGEX.test(profile.auth_user_id);
          const isRealId = profile.id && UUID_REGEX.test(profile.id);
          const toInsert: Record<string, any> = {
            ...profile,
            auth_user_id: isRealAuthId ? profile.auth_user_id : null,
          };
          if (!isRealId) {
            delete toInsert.id;
          }
          const { data, error } = await supabase
            .from('profiles')
            .insert([toInsert])
            .select()
            .single();
          if (!error && data) return data as UserProfile;
        } catch {
          // Fall through to localStore
        }
      }
    }
    return localStore.createProfile(profile);
  },

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as UserProfile;
      }
    }
    return localStore.updateProfile(id, updates);
  },

  // Services
  async getProfiles(): Promise<UserProfile[]> {
    let supabaseProfiles: UserProfile[] = [];
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
          if (!error && data) supabaseProfiles = data as UserProfile[];
        } catch {}
      }
    }
    const localProfiles = localStore.getProfiles();
    if (supabaseProfiles.length > 0) {
      const existingEmails = new Set(supabaseProfiles.map((p) => p.email.toLowerCase()));
      const combined = [...supabaseProfiles];
      for (const lp of localProfiles) {
        if (!existingEmails.has(lp.email.toLowerCase())) {
          combined.push(lp);
        }
      }
      return combined;
    }
    return localProfiles;
  },

  async getServiceById(id: string): Promise<Service | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('services')
          .select('*, items:service_items(*), category:service_categories(*)')
          .eq('id', id)
          .single();
        if (!error && data) return data as unknown as Service;
      }
    }
    return localStore.getServiceById(id);
  },

  async createService(service: Omit<Service, 'created_at' | 'updated_at'>): Promise<Service> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('services')
          .insert([service])
          .select()
          .single();
        if (!error && data) return data as Service;
      }
    }
    return localStore.createService(service);
  },

  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('services')
          .select('*, items:service_items(*), category:service_categories(*)')
          .order('created_at', { ascending: true });
        if (!error && data) return data as unknown as Service[];
      }
    }
    return localStore.getServices();
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('services')
          .select('*, items:service_items(*), category:service_categories(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) return data as unknown as Service;
      }
    }
    return localStore.getServiceBySlug(slug);
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as unknown as Service;
      }
    }
    return localStore.updateService(id, updates);
  },

  // Addresses
  async getUserAddresses(userId: string): Promise<Address[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as Address[];
      }
    }
    return localStore.getUserAddresses(userId);
  },

  async createAddress(address: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const isRealId = (address as any).id && UUID_REGEX.test((address as any).id);
          const isRealUserId = address.user_id && UUID_REGEX.test(address.user_id);
          if (isRealUserId) {
            const toInsert: Record<string, any> = { ...address };
            if (!isRealId) {
              delete toInsert.id;
            }
            const { data, error } = await supabase
              .from('addresses')
              .insert([toInsert])
              .select()
              .single();
            if (!error && data) return data as Address;
          }
        } catch {
          // Fall through to localStore
        }
      }
    }
    return localStore.createAddress(address);
  },

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error } = await supabase
          .from('addresses')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (!error) return true;
      }
    }
    return localStore.deleteAddress(id, userId);
  },

  // Time Slots
  async getTimeSlots(): Promise<TimeSlot[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('time_slots')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data) return data as TimeSlot[];
      }
    }
    return localStore.getTimeSlots();
  },

  async updateTimeSlot(id: string, updates: Partial<TimeSlot>): Promise<TimeSlot | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('time_slots')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as TimeSlot;
      }
    }
    return localStore.updateTimeSlot(id, updates);
  },

  async createTimeSlot(slot: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>): Promise<TimeSlot> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('time_slots')
          .insert([slot])
          .select()
          .single();
        if (!error && data) return data as TimeSlot;
      }
    }
    return localStore.createTimeSlot(slot);
  },

  // Service Areas
  async getServiceAreas(): Promise<ServiceArea[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('service_areas')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data) return data as ServiceArea[];
      }
    }
    return localStore.getServiceAreas();
  },

  async updateServiceArea(id: string, updates: Partial<ServiceArea>): Promise<ServiceArea | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('service_areas')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as ServiceArea;
      }
    }
    return localStore.updateServiceArea(id, updates);
  },

  async createServiceArea(area: Omit<ServiceArea, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceArea> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('service_areas')
          .insert([area])
          .select()
          .single();
        if (!error && data) return data as ServiceArea;
      }
    }
    return localStore.createServiceArea(area);
  },

  // Business Hours
  async getBusinessHours(): Promise<BusinessHour[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('business_hours')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data) return data as BusinessHour[];
      }
    }
    return localStore.getBusinessHours();
  },

  async updateBusinessHours(id: string, updates: Partial<BusinessHour>): Promise<BusinessHour | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('business_hours')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as BusinessHour;
      }
    }
    return localStore.updateBusinessHours(id, updates);
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    let supabaseBookings: Booking[] = [];
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .select('*, service:services(*), address:addresses(*), user:profiles(*), items:booking_items(*)')
            .order('created_at', { ascending: false });
          if (!error && data) {
            supabaseBookings = data as unknown as Booking[];
          }
        } catch {}
      }
    }
    const localBookings = localStore.getBookings();
    if (supabaseBookings.length > 0) {
      const existingRefs = new Set(supabaseBookings.map((b) => b.booking_reference || b.id));
      const combined = [...supabaseBookings];
      for (const lb of localBookings) {
        if (!existingRefs.has(lb.booking_reference) && !existingRefs.has(lb.id)) {
          combined.push(lb);
        }
      }
      return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return localBookings;
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, service:services(*), address:addresses(*), user:profiles(*), items:booking_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as unknown as Booking[];
      }
    }
    return localStore.getUserBookings(userId);
  },

  async getBookingById(id: string): Promise<Booking | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, service:services(*), address:addresses(*), user:profiles(*), items:booking_items(*)')
          .or(`id.eq.${id},booking_reference.eq.${id}`)
          .single();
        if (!error && data) return data as unknown as Booking;
      }
    }
    return localStore.getBookingById(id);
  },

  async createBooking(
    booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>,
    items?: Array<{ name: string; quantity: number }>
  ): Promise<Booking | null> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const isRealUserId = booking.user_id && UUID_REGEX.test(booking.user_id);
          const isRealAddressId = booking.address_id && UUID_REGEX.test(booking.address_id);
          const isRealServiceId = booking.service_id && UUID_REGEX.test(booking.service_id);

          // Only attempt Supabase insert if referenced IDs are valid UUIDs
          if (isRealUserId && isRealAddressId && isRealServiceId) {
            const { data: bData, error: bError } = await supabase
              .from('bookings')
              .insert([booking])
              .select()
              .single();
            if (!bError && bData) {
              if (items && items.length > 0) {
                const bookingItems = items.map((i) => ({
                  booking_id: bData.id,
                  item_name: i.name,
                  quantity: i.quantity,
                }));
                await supabase.from('booking_items').insert(bookingItems);
              }
              const retrieved = await db.getBookingById(bData.id);
              if (retrieved) return retrieved;
            }
          }
        } catch {
          // Fall through to localStore
        }
      }
    }
    return localStore.createBooking(booking, items);
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .update({ status, updated_at: new Date().toISOString() })
          .or(`id.eq.${id},booking_reference.eq.${id}`)
          .select()
          .single();
        if (!error && data) {
          return db.getBookingById(data.id);
        }
      }
    }
    return localStore.updateBookingStatus(id, status);
  },

  // Contact Messages
  async createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([msg])
          .select()
          .single();
        if (!error && data) return data as ContactMessage;
      }
    }
    return localStore.createContactMessage(msg);
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as ContactMessage[];
      }
    }
    return localStore.getContactMessages();
  },

  async updateContactMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<ContactMessage | null> {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_messages')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as ContactMessage;
      }
    }
    return localStore.updateContactMessageStatus(id, status);
  },

  // ==============================================================================
  // IRONING PRICING & PROMOTIONS CONFIG
  // ==============================================================================
  async getIroningConfig(): Promise<IroningPricingConfig> {
    return localStore.getIroningConfig();
  },

  async updateIroningConfig(updates: Partial<IroningPricingConfig>): Promise<IroningPricingConfig> {
    return localStore.updateIroningConfig(updates);
  },

  // ==============================================================================
  // MONTHLY SUBSCRIPTION PLANS
  // ==============================================================================
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return localStore.getSubscriptionPlans();
  },

  async updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    return localStore.updateSubscriptionPlan(id, updates);
  },

  async getUserActiveSubscription(userId: string): Promise<CustomerSubscription | null> {
    return localStore.getUserActiveSubscription(userId);
  },

  async getUserSubscriptions(userId: string): Promise<CustomerSubscription[]> {
    return localStore.getUserSubscriptions(userId);
  },

  async createSubscription(data: Omit<CustomerSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerSubscription> {
    return localStore.createSubscription(data);
  },

  async cancelSubscription(subscriptionId: string, userId: string): Promise<boolean> {
    return localStore.cancelSubscription(subscriptionId, userId);
  },

  async recordSubscriptionUsage(
    subscriptionId: string,
    bookingId: string,
    bookingReference: string,
    garmentsCount: number,
    notes?: string
  ): Promise<boolean> {
    return localStore.recordSubscriptionUsage(subscriptionId, bookingId, bookingReference, garmentsCount, notes);
  },

  async restoreSubscriptionUsage(bookingId: string): Promise<boolean> {
    return localStore.restoreSubscriptionUsage(bookingId);
  },

  async getSubscriptionUsageHistory(subscriptionId: string): Promise<SubscriptionUsageRecord[]> {
    return localStore.getSubscriptionUsageHistory(subscriptionId);
  },

  // ==============================================================================
  // PROMOTIONAL OFFER: EVERY 5TH ORDER FREE
  // ==============================================================================
  async getUserLoyaltyProgress(userId: string) {
    return localStore.getUserLoyaltyProgress(userId);
  },

  async checkAndAwardLoyaltyReward(userId: string): Promise<FreeOrderReward | null> {
    return localStore.checkAndAwardLoyaltyReward(userId);
  },

  async redeemFreeOrderReward(
    rewardId: string,
    bookingId: string,
    bookingReference: string,
    discountAmount: number
  ): Promise<boolean> {
    return localStore.redeemFreeOrderReward(rewardId, bookingId, bookingReference, discountAmount);
  },

  // ==============================================================================
  // WORKER INTEGRATION & PAYOUTS
  // ==============================================================================
  calculateWorkerPayout(booking: Booking): number {
    return localStore.calculateWorkerPayout(booking);
  },

  async getWorkerBookings(workerId?: string) {
    return localStore.getWorkerBookings(workerId);
  },

  async assignWorkerToBooking(bookingId: string, workerId: string, workerName?: string) {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          await supabase
            .from('bookings')
            .update({ worker_id: workerId, worker_name: workerName, updated_at: new Date().toISOString() })
            .or(`id.eq.${bookingId},booking_reference.eq.${bookingId}`);
        } catch {}
      }
    }
    return localStore.assignWorkerToBooking(bookingId, workerId, workerName);
  },

  // ==============================================================================
  // ADMIN PRICING STATS & AUDIT LOGS
  // ==============================================================================
  async getAdminPricingStats(): Promise<AdminPricingStats> {
    return localStore.getAdminPricingStats();
  },

  async addAuditLog(entry: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    return localStore.addAuditLog(entry);
  },

  async getAuditLogs(limit?: number): Promise<AuditLog[]> {
    return localStore.getAuditLogs(limit);
  },
};

