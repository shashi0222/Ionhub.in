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

function hydrateProfile(p: any): UserProfile | null {
  if (!p) return null;
  const clone = { ...p };
  if (clone.avatar_url && typeof clone.avatar_url === 'string' && clone.avatar_url.startsWith('worker:')) {
    clone.role = 'worker';
    clone.password = clone.avatar_url.replace('worker:', '');
  }
  return clone as UserProfile;
}

export const db = {
  // Profiles
  async getProfileById(id: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .or(`id.eq.${id},auth_user_id.eq.${id}`)
            .single();
          if (!error && data) return hydrateProfile(data);
        } catch {}
      }
    }
    return hydrateProfile(localStore.getProfileById(id)) || null;
  },

  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('email', email)
            .single();
          if (!error && data) return hydrateProfile(data);
        } catch {}
      }
    }
    return hydrateProfile(localStore.getProfileByEmail(email)) || null;
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
          const avatarUrl =
            profile.avatar_url ||
            (profile.role === 'worker' && profile.password ? `worker:${profile.password}` : null);

          let pData: any = null;

          // 1. Try full insert (with role: 'worker' and password if schema supports it)
          const fullInsert: Record<string, any> = {
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone || null,
            role: profile.role || 'customer',
            password: profile.password || null,
            avatar_url: avatarUrl,
            auth_user_id: isRealAuthId ? profile.auth_user_id : null,
          };
          if (isRealId) fullInsert.id = profile.id;

          const res1 = await supabase.from('profiles').insert([fullInsert]).select().single();
          if (!res1.error && res1.data) {
            pData = res1.data;
          } else {
            // 2. Fallback to guaranteed schema: role='customer' (or 'admin') and encoded avatar_url
            const safeInsert: Record<string, any> = {
              full_name: profile.full_name,
              email: profile.email,
              phone: profile.phone || null,
              role: profile.role === 'admin' ? 'admin' : 'customer',
              avatar_url: avatarUrl,
              auth_user_id: isRealAuthId ? profile.auth_user_id : null,
            };
            if (isRealId) safeInsert.id = profile.id;

            const res2 = await supabase.from('profiles').insert([safeInsert]).select().single();
            if (!res2.error && res2.data) {
              pData = res2.data;
            }
          }

          if (pData) {
            const savedProfile: UserProfile = {
              ...pData,
              role: profile.role,
              password: profile.password,
            };
            localStore.createProfile(savedProfile);
            return savedProfile;
          }
        } catch (e) {
          console.error('Exception in createProfile Supabase insert:', e);
        }
      }
    }
    return localStore.createProfile(profile);
  },

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          if (!error && data) return hydrateProfile(data);
        } catch {}
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
    const localProfiles = localStore.getProfiles().map((p) => hydrateProfile(p)!);
    if (supabaseProfiles.length > 0) {
      const hydratedSupabase = supabaseProfiles.map((p) => hydrateProfile(p)!);
      const existingEmails = new Set(hydratedSupabase.map((p) => p.email.toLowerCase()));
      const combined = [...hydratedSupabase];
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
            const toInsert: Record<string, any> = {
              user_id: address.user_id,
              label: address.label || 'Home',
              address_line: address.address_line,
              area: address.area,
              city: address.city || 'Hyderabad',
              state: address.state || 'Telangana',
              pincode: address.pincode || '500100',
              landmark: address.landmark || null,
            };
            if (isRealId) {
              toInsert.id = (address as any).id;
            }
            const { data, error } = await supabase
              .from('addresses')
              .insert([toInsert])
              .select()
              .single();
            if (!error && data) {
              localStore.createAddress({ ...address, id: data.id } as any);
              return data as Address;
            }
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

    // Merge Supabase and LocalStore so NO bookings are ever lost
    const combined: Booking[] = [...supabaseBookings];
    const existingKeys = new Set<string>();
    for (const b of supabaseBookings) {
      if (b.booking_reference) existingKeys.add(b.booking_reference.toLowerCase());
      if (b.id) existingKeys.add(b.id.toLowerCase());
    }

    for (const lb of localBookings) {
      const ref = (lb.booking_reference || '').toLowerCase();
      const id = (lb.id || '').toLowerCase();
      if ((ref && existingKeys.has(ref)) || (id && existingKeys.has(id))) {
        continue;
      }
      combined.push(lb);
      if (ref) existingKeys.add(ref);
      if (id) existingKeys.add(id);
    }

    // Ensure service, user, and address relations are populated for every booking
    const allServices = localStore.getServices();
    const serviceMap = new Map(allServices.map((s) => [s.id, s]));

    for (const b of combined) {
      if (!b.service && b.service_id) {
        b.service = serviceMap.get(b.service_id) || localStore.getServiceById(b.service_id) || undefined;
      }
      if (!b.user && b.user_id) {
        b.user = localStore.getProfileById(b.user_id) || undefined;
      }
      if (!b.address && b.address_id) {
        b.address = localStore.getAddressById(b.address_id) || undefined;
      }
    }

    return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
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
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          if (!error && data) supabaseBookings = data as unknown as Booking[];
        } catch {}
      }
    }
    const localBookings = localStore.getUserBookings(userId);

    const combined: Booking[] = [...supabaseBookings];
    const existingKeys = new Set<string>();
    for (const b of supabaseBookings) {
      if (b.booking_reference) existingKeys.add(b.booking_reference.toLowerCase());
      if (b.id) existingKeys.add(b.id.toLowerCase());
    }

    for (const lb of localBookings) {
      const ref = (lb.booking_reference || '').toLowerCase();
      const id = (lb.id || '').toLowerCase();
      if ((ref && existingKeys.has(ref)) || (id && existingKeys.has(id))) {
        continue;
      }
      combined.push(lb);
      if (ref) existingKeys.add(ref);
      if (id) existingKeys.add(id);
    }

    const allServices = localStore.getServices();
    const serviceMap = new Map(allServices.map((s) => [s.id, s]));

    for (const b of combined) {
      if (!b.service && b.service_id) {
        b.service = serviceMap.get(b.service_id) || localStore.getServiceById(b.service_id) || undefined;
      }
      if (!b.user && b.user_id) {
        b.user = localStore.getProfileById(b.user_id) || undefined;
      }
      if (!b.address && b.address_id) {
        b.address = localStore.getAddressById(b.address_id) || undefined;
      }
    }

    return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getBookingById(id: string): Promise<Booking | null> {
    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .select('*, service:services(*), address:addresses(*), user:profiles(*), items:booking_items(*)')
            .or(`id.eq.${id},booking_reference.eq.${id}`)
            .single();
          if (!error && data) return data as unknown as Booking;
        } catch {}
      }
    }
    return localStore.getBookingById(id);
  },

  async createBooking(
    booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>,
    items?: Array<{ name: string; quantity: number }>
  ): Promise<Booking | null> {
    let savedBooking: Booking | null = null;

    if (isSupabaseConfigured()) {
      const adminClient = createAdminSupabaseClient();
      const userClient = await createServerSupabaseClient();
      const supabase = adminClient || userClient;
      if (supabase) {
        try {
          // 1. Ensure foreign key user profile exists in Supabase
          if (booking.user_id && UUID_REGEX.test(booking.user_id)) {
            const { data: userExists } = await supabase.from('profiles').select('id').eq('id', booking.user_id).single();
            if (!userExists) {
              const localProf = localStore.getProfileById(booking.user_id);
              if (localProf) {
                await supabase.from('profiles').insert([{
                  id: localProf.id,
                  full_name: localProf.full_name,
                  phone: localProf.phone || null,
                  email: localProf.email,
                  role: localProf.role,
                  avatar_url: localProf.avatar_url || null,
                  auth_user_id: null,
                }]);
              }
            }
          }

          // 2. Ensure foreign key address exists in Supabase
          if (booking.address_id && UUID_REGEX.test(booking.address_id)) {
            const { data: addrExists } = await supabase.from('addresses').select('id').eq('id', booking.address_id).single();
            if (!addrExists) {
              const localAddr = localStore.getAddressById(booking.address_id);
              if (localAddr) {
                await supabase.from('addresses').insert([{
                  id: localAddr.id,
                  user_id: localAddr.user_id,
                  label: localAddr.label || 'Home',
                  address_line: localAddr.address_line,
                  area: localAddr.area,
                  city: localAddr.city || 'Hyderabad',
                  state: localAddr.state || 'Telangana',
                  pincode: localAddr.pincode || '500100',
                  landmark: localAddr.landmark || null,
                }]);
              }
            }
          }

          const isRealUserId = booking.user_id && UUID_REGEX.test(booking.user_id);
          const isRealAddressId = booking.address_id && UUID_REGEX.test(booking.address_id);
          const isRealServiceId = booking.service_id && UUID_REGEX.test(booking.service_id);

          if (isRealUserId && isRealAddressId && isRealServiceId) {
            // First attempt inserting with full fields
            let bData: any = null;
            const fullRes = await supabase.from('bookings').insert([booking]).select().single();
            if (!fullRes.error && fullRes.data) {
              bData = fullRes.data;
            } else {
              // Fallback to base columns guaranteed by schema
              const baseBooking: Record<string, any> = {
                booking_reference: booking.booking_reference,
                user_id: booking.user_id,
                service_id: booking.service_id,
                address_id: booking.address_id,
                booking_date: booking.booking_date,
                time_slot: booking.time_slot,
                status: booking.status || 'PENDING',
                customer_notes: booking.customer_notes || null,
                total_amount: booking.final_payable_amount ?? booking.total_amount ?? booking.subtotal ?? 0,
              };
              const baseRes = await supabase.from('bookings').insert([baseBooking]).select().single();
              if (!baseRes.error && baseRes.data) {
                bData = baseRes.data;
              }
            }

            if (bData) {
              if (items && items.length > 0) {
                const bookingItems = items.map((i) => ({
                  booking_id: bData.id,
                  item_name: i.name,
                  quantity: i.quantity,
                }));
                await supabase.from('booking_items').insert(bookingItems);
              }
              const retrieved = await db.getBookingById(bData.id);
              if (retrieved) savedBooking = retrieved;
            }
          }
        } catch (e) {
          console.error('Supabase booking creation error:', e);
        }
      }
    }

    // ALWAYS write to localStore as well so local/serverless persistence is complete
    const localSaved = localStore.createBooking(booking, items);
    return savedBooking || localSaved;
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

