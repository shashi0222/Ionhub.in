-- ==============================================================================
-- ION HUB - FULL DATABASE SCHEMA & RLS POLICIES
-- PostgreSQL / Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'PICKUP_SCHEDULED',
        'PICKED_UP',
        'IN_SERVICE',
        'READY',
        'OUT_FOR_DELIVERY',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    role user_role DEFAULT 'customer' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    image_url TEXT,
    duration_minutes INT,
    price NUMERIC(10, 2), -- Nullable, displays "Get Quote" if null
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. SERVICE ITEMS / OPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Home' NOT NULL,
    address_line TEXT NOT NULL,
    area TEXT NOT NULL DEFAULT 'Kompally',
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    state TEXT NOT NULL DEFAULT 'Telangana',
    pincode TEXT NOT NULL DEFAULT '500100',
    landmark TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TIME SLOTS TABLE
CREATE TABLE IF NOT EXISTS public.time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_time TEXT NOT NULL UNIQUE, -- e.g., '06:00 PM - 07:00 PM'
    capacity INT DEFAULT 5 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. SERVICE AREAS TABLE
CREATE TABLE IF NOT EXISTS public.service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    pincode TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(area_name, pincode)
);

-- 10. BUSINESS HOURS TABLE
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week TEXT NOT NULL,
    opening_time TEXT NOT NULL DEFAULT '18:00',
    closing_time TEXT NOT NULL DEFAULT '23:00',
    is_open BOOLEAN DEFAULT TRUE NOT NULL,
    note TEXT DEFAULT 'Daily 6 PM – 11 PM, Weekends Available',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    address_id UUID NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status booking_status DEFAULT 'PENDING' NOT NULL,
    customer_notes TEXT,
    total_amount NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. BOOKING ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_item_id UUID REFERENCES public.service_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    unit_price NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL, -- 'unread', 'read', 'replied'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'booking' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE auth_user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth_user_id = auth.uid());

CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (auth_user_id = auth.uid() OR public.is_admin());

-- CATALOG POLICIES (Public read active, Admin all)
CREATE POLICY "Public read active categories"
    ON public.service_categories FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage categories"
    ON public.service_categories FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public read active services"
    ON public.services FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage services"
    ON public.services FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public read active service items"
    ON public.service_items FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage service items"
    ON public.service_items FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public read active time slots"
    ON public.time_slots FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage time slots"
    ON public.time_slots FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public read active service areas"
    ON public.service_areas FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage service areas"
    ON public.service_areas FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public read business hours"
    ON public.business_hours FOR SELECT
    USING (TRUE);

CREATE POLICY "Admin manage business hours"
    ON public.business_hours FOR ALL
    USING (public.is_admin());

-- ADDRESS POLICIES
CREATE POLICY "Users can view own addresses"
    ON public.addresses FOR SELECT
    USING (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "Users can insert own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Users can update own addresses"
    ON public.addresses FOR UPDATE
    USING (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Users can delete own addresses"
    ON public.addresses FOR DELETE
    USING (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

-- BOOKING POLICIES
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "Users can insert own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Admins can update bookings"
    ON public.bookings FOR UPDATE
    USING (public.is_admin() OR user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

-- BOOKING ITEMS POLICIES
CREATE POLICY "Users and admins can view booking items"
    ON public.booking_items FOR SELECT
    USING (
        booking_id IN (
            SELECT b.id FROM public.bookings b
            JOIN public.profiles p ON b.user_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
        OR public.is_admin()
    );

CREATE POLICY "Users can insert booking items"
    ON public.booking_items FOR INSERT
    WITH CHECK (
        booking_id IN (
            SELECT b.id FROM public.bookings b
            JOIN public.profiles p ON b.user_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Admin can view and manage contact messages"
    ON public.contact_messages FOR ALL
    USING (public.is_admin());

-- REVIEWS POLICIES
CREATE POLICY "Public can view approved reviews"
    ON public.reviews FOR SELECT
    USING (is_approved = TRUE OR public.is_admin());

CREATE POLICY "Users can submit reviews for own bookings"
    ON public.reviews FOR INSERT
    WITH CHECK (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (
        user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 1. Sync new auth.user to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (auth_user_id, full_name, email, role, phone)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'customer'),
        new.raw_user_meta_data->>'phone'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Auto update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Categories
INSERT INTO public.service_categories (id, name, slug, description, icon, display_order)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'Automotive Care', 'automotive-care', 'Eco-friendly doorstep vehicle cleaning and detailing', 'Car', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Garment Care', 'garment-care', 'Crisp, wrinkle-free clothes with doorstep pickup & delivery', 'Shirt', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Home Services', 'home-services', 'Everyday home care and deep cleaning services', 'Home', 3)
ON CONFLICT (slug) DO NOTHING;

-- Services
INSERT INTO public.services (id, category_id, name, slug, description, short_description, image_url, duration_minutes, price, is_active, is_featured)
VALUES 
    (
        's1111111-1111-1111-1111-111111111111',
        'c1111111-1111-1111-1111-111111111111',
        'Doorstep Car Wash',
        'car-wash',
        'Sparkling clean cars, happier drives. Our trained specialists arrive at your doorstep equipped with eco-friendly solutions, high-grade microfiber tools, and safe washing techniques to leave your vehicle looking brand new.',
        'Professional eco-friendly wash, interior vacuuming & spotless finish at your home.',
        '/brand/creative_carwash.jpeg',
        60,
        NULL, -- Displays "Get Quote"
        TRUE,
        TRUE
    ),
    (
        's2222222-2222-2222-2222-222222222222',
        'c2222222-2222-2222-2222-222222222222',
        'Professional Ironing',
        'ironing',
        'Zero ironing hassle. We collect your garments, give them crisp, professional pressing with temperature-controlled precision, pack them neatly, and deliver right back to your doorstep.',
        'Steam and dry press for shirts, trousers, formal wear with pickup & delivery.',
        '/brand/creative_ironing.jpeg',
        45,
        NULL, -- Displays "Get Quote"
        TRUE,
        TRUE
    ),
    (
        's3333333-3333-3333-3333-333333333333',
        'c3333333-3333-3333-3333-333333333333',
        'Home Services',
        'home-services',
        'Comprehensive home care, deep cleaning, and appliance sanitization tailored for modern living.',
        'Everyday home cleaning, kitchen & bathroom sanitization.',
        '/brand/logo_source.png',
        120,
        NULL,
        FALSE, -- Coming Soon
        FALSE
    )
ON CONFLICT (slug) DO NOTHING;

-- Service Items for Car Wash
INSERT INTO public.service_items (service_id, name, description, is_active)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'Exterior Wash & Dry', 'High-pressure gentle foam rinse and streak-free dry', TRUE),
    ('s1111111-1111-1111-1111-111111111111', 'Interior Vacuuming', 'Complete vacuuming of floor mats, seats, and footwells', TRUE),
    ('s1111111-1111-1111-1111-111111111111', 'Dashboard & Trim Cleaning', 'Dust removal and gentle UV protective conditioning', TRUE),
    ('s1111111-1111-1111-1111-111111111111', 'Tire & Rim Cleaning', 'Brake dust removal and deep tire gloss finish', TRUE),
    ('s1111111-1111-1111-1111-111111111111', 'Spotless Finish', 'Microfiber glass buffing and paint inspection', TRUE);

-- Service Items for Ironing
INSERT INTO public.service_items (service_id, name, description, is_active)
VALUES
    ('s2222222-2222-2222-2222-222222222222', 'Shirts', 'Crisp collars, sleeves, and wrinkle-free body press', TRUE),
    ('s2222222-2222-2222-2222-222222222222', 'Trousers & Chinos', 'Sharp center crease or flat press as preferred', TRUE),
    ('s2222222-2222-2222-2222-222222222222', 'Formal Wear & Blazers', 'Delicate temperature-controlled steaming and care', TRUE),
    ('s2222222-2222-2222-2222-222222222222', 'Other Suitable Garments', 'Kurtas, dresses, linens, and everyday wear', TRUE),
    ('s2222222-2222-2222-2222-222222222222', 'Neat Eco-Packing', 'Hanger or folded packing in protective eco covers', TRUE);

-- Service Area
INSERT INTO public.service_areas (area_name, city, pincode, is_active)
VALUES ('Kompally', 'Hyderabad', '500100', TRUE)
ON CONFLICT (area_name, pincode) DO NOTHING;

-- Time Slots (6 PM - 11 PM daily)
INSERT INTO public.time_slots (slot_time, capacity, is_active, display_order)
VALUES
    ('06:00 PM - 07:00 PM', 5, TRUE, 1),
    ('07:00 PM - 08:00 PM', 5, TRUE, 2),
    ('08:00 PM - 09:00 PM', 5, TRUE, 3),
    ('09:00 PM - 10:00 PM', 5, TRUE, 4),
    ('10:00 PM - 11:00 PM', 5, TRUE, 5)
ON CONFLICT (slot_time) DO NOTHING;

-- Business Hours
INSERT INTO public.business_hours (day_of_week, opening_time, closing_time, is_open, note)
VALUES 
    ('Monday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available'),
    ('Tuesday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available'),
    ('Wednesday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available'),
    ('Thursday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available'),
    ('Friday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available'),
    ('Saturday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available'),
    ('Sunday', '18:00', '23:00', TRUE, 'Daily 6 PM – 11 PM, Weekends Available');

-- ==============================================================================
-- 18. MIGRATION FOR COMPREHENSIVE BOOKINGS & RLS
-- ==============================================================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pricing_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pairs_count INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS garments_count INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS reward_id_applied TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS subscription_id_applied TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS overage_garments INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS overage_charge NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS final_payable_amount NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PAID';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_payout NUMERIC(10, 2);

-- Permissive policies so guest checkouts and admin viewing are never rejected by RLS
DO $$ BEGIN
    CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Public insert addresses" ON public.addresses FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Public select bookings" ON public.bookings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Support worker role and password on profiles
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'worker';
EXCEPTION WHEN undefined_object THEN null;
          WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password TEXT;

DO $$ BEGIN
    CREATE POLICY "Public select profiles" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;


