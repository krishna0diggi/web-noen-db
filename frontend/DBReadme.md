# LooksNLove - PostgreSQL Database Documentation

## 🗄️ Database Overview

This document outlines the complete PostgreSQL database architecture for the LooksNLove ladies salon management system. The database is designed to support a full-featured salon with customer management, appointment booking, service management, staff coordination, and business analytics.

### Database Technology
- **Primary Database**: PostgreSQL 15+
- **ORM**: Prisma or raw SQL with pg library
- **Real-time Features**: PostgreSQL LISTEN/NOTIFY
- **Authentication**: JWT-based authentication with secure sessions
- **File Storage**: PostgreSQL BYTEA or cloud storage
- **API**: RESTful APIs with Express.js/FastAPI
- **Connection Pooling**: PgBouncer recommended

## 📊 Current Implementation Status

### ✅ Frontend Ready Features
- Customer management with data table
- Order management with status tracking  
- Service ordering and visibility control
- Ratings and review management
- **Admin-Controlled Discount System** with full CRUD operations
- Responsive data tables with pagination
- Real-time UI updates with optimistic rendering
- **Blinking/Highlighting Active Discounts** on homepage and user dashboard

### 🔄 Backend Integration Required
All frontend components are designed with backend integration in mind. The data structures and API interfaces are defined and ready for PostgreSQL connection.

## 🏗️ PostgreSQL Table Schemas

### Core Tables

#### 1. Users Table (`users`)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('female', 'male', 'other', 'prefer_not_to_say')),
    
    -- Address as JSON for flexibility
    address JSONB,
    -- Example: {"street": "123 Beauty St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}
    
    profile_image_url TEXT,
    user_type VARCHAR(20) DEFAULT 'customer' CHECK (user_type IN ('customer', 'admin', 'staff')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'vip')),
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 2. Service Categories Table (`service_categories`)
```sql
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 3. Services Table (`services`)
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL, -- Current price with discounts applied
    applied_discount_id UUID REFERENCES discounts(id) ON DELETE SET NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    requirements TEXT,
    preparation_notes TEXT,
    aftercare_instructions TEXT,
    tags TEXT[], -- Array of tags
    price_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_is_popular ON services(is_popular);
CREATE INDEX idx_services_display_order ON services(display_order);

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4. Discounts Table (`discounts`) - **Admin Controlled Visibility**
```sql
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_services TEXT[] DEFAULT ARRAY['All Services'], -- Array of service names
    customer_tier VARCHAR(20) DEFAULT 'all' CHECK (customer_tier IN ('all', 'vip', 'regular')),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT false, -- **ADMIN CONTROLS THIS** - only active discounts show on frontend
    is_festival BOOLEAN DEFAULT false, -- Triggers blinking animation
    usage_limit INTEGER, -- NULL for unlimited
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_discounts_is_active ON discounts(is_active);
CREATE INDEX idx_discounts_valid_until ON discounts(valid_until);
CREATE INDEX idx_discounts_customer_tier ON discounts(customer_tier);
CREATE INDEX idx_discounts_is_festival ON discounts(is_festival);

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 5. Appointments Table (`appointments`)
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    discount_id UUID REFERENCES discounts(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    original_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL, -- original_amount - discount_amount
    deposit_amount DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'failed')),
    notes TEXT,
    cancellation_reason TEXT,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_payment_status ON appointments(payment_status);

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 6. Appointment Services Table (`appointment_services`) - Junction Table
```sql
CREATE TABLE appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_appointment_services_appointment_id ON appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service_id ON appointment_services(service_id);
```

#### 7. Reviews Table (`reviews`)
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    review_type VARCHAR(20) DEFAULT 'website' CHECK (review_type IN ('website', 'google', 'facebook')),
    source_url TEXT,
    location VARCHAR(100), -- For Google reviews
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_appointment_id ON reviews(appointment_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_is_featured ON reviews(is_featured);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔄 PostgreSQL API Endpoints Structure

### Authentication Endpoints
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
```

### Customer Management
```
GET    /api/customers              # List customers with pagination
POST   /api/customers              # Create new customer
GET    /api/customers/:id          # Get customer details
PUT    /api/customers/:id          # Update customer
DELETE /api/customers/:id          # Delete customer
PUT    /api/customers/:id/status   # Update customer status (VIP/regular)
GET    /api/customers/stats        # Customer statistics
```

### **Admin-Controlled Discount Management**
```
GET    /api/discounts              # List all discounts (admin only)
POST   /api/discounts              # Create new discount (admin only)
PUT    /api/discounts/:id          # Update discount (admin only)
DELETE /api/discounts/:id          # Delete discount (admin only)
PUT    /api/discounts/:id/activate # **ADMIN ACTIVATES DISCOUNT** (admin only)
PUT    /api/discounts/:id/deactivate # **ADMIN DEACTIVATES DISCOUNT** (admin only)
GET    /api/discounts/active       # Get ONLY ACTIVE discounts for customers
GET    /api/discounts/analytics    # Discount usage analytics
```

### **Customer-Facing Discount Endpoints** (Only Active Discounts)
```
GET    /api/public/discounts/active        # Get active discounts for homepage
GET    /api/user/discounts/active/:tier    # Get active discounts for user dashboard
POST   /api/services/calculate-price       # Calculate service price with active discounts
```

### Service Management with Discount Integration
```
GET    /api/services               # List services with current pricing
POST   /api/services               # Create service (admin only)
PUT    /api/services/:id           # Update service (admin only)
DELETE /api/services/:id           # Delete service (admin only)
GET    /api/services/categories    # Get service categories
GET    /api/services/pricing/:tier # Get services with customer-tier pricing
```

### Appointment Management
```
GET    /api/appointments           # List appointments with filters
POST   /api/appointments           # Create appointment with discount application
GET    /api/appointments/:id       # Get appointment details
PUT    /api/appointments/:id       # Update appointment
DELETE /api/appointments/:id       # Cancel appointment
GET    /api/appointments/calendar  # Calendar view of appointments
```

## 💰 **PostgreSQL Discount System - Admin Controlled Visibility**

### **Key Principle: Only Admin-Activated Discounts Are Visible**

```sql
-- SQL query for customer-facing pages (homepage, user dashboard)
SELECT 
    id,
    name,
    description,
    discount_type,
    discount_value,
    customer_tier,
    is_festival,
    valid_until,
    EXTRACT(EPOCH FROM (valid_until - NOW())) / 86400 AS days_remaining
FROM discounts 
WHERE 
    is_active = true              -- ✅ ADMIN MUST SET THIS TO TRUE
    AND valid_until > NOW()       -- ✅ Not expired
    AND (
        customer_tier = 'all' 
        OR customer_tier = $1     -- User's tier (vip/regular)
    )
ORDER BY 
    is_festival DESC,
    discount_value DESC;
```

### **Admin Controls**
```sql
-- Admin activates discount (makes it visible to customers)
UPDATE discounts 
SET 
    is_active = true,
    updated_at = NOW()
WHERE id = $1;

-- Admin deactivates discount (hides from customers)
UPDATE discounts 
SET 
    is_active = false,
    updated_at = NOW()
WHERE id = $1;
```

### **Price Update Stored Procedure**
```sql
CREATE OR REPLACE FUNCTION update_service_prices_on_discount_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If discount is being activated
    IF NEW.is_active = true AND (OLD.is_active = false OR OLD.is_active IS NULL) THEN
        -- Apply discount to applicable services
        UPDATE services 
        SET 
            current_price = CASE 
                WHEN NEW.discount_type = 'percentage' THEN 
                    base_price * (1 - NEW.discount_value / 100)
                ELSE 
                    GREATEST(0, base_price - NEW.discount_value)
            END,
            applied_discount_id = NEW.id,
            price_updated_at = NOW()
        WHERE 
            is_active = true 
            AND (
                'All Services' = ANY(NEW.applicable_services)
                OR name = ANY(NEW.applicable_services)
            );
    
    -- If discount is being deactivated
    ELSIF NEW.is_active = false AND OLD.is_active = true THEN
        -- Reset to base price for services using this discount
        UPDATE services 
        SET 
            current_price = base_price,
            applied_discount_id = NULL,
            price_updated_at = NOW()
        WHERE applied_discount_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discount_price_update_trigger
    AFTER UPDATE OF is_active ON discounts
    FOR EACH ROW
    EXECUTE FUNCTION update_service_prices_on_discount_change();
```

### **Active Discounts with Time Calculations View**
```sql
CREATE VIEW active_discounts_with_timing AS
SELECT 
    id,
    name,
    description,
    discount_type,
    discount_value,
    customer_tier,
    is_festival,
    valid_until,
    CASE 
        WHEN EXTRACT(EPOCH FROM (valid_until - NOW())) > 86400 THEN
            CONCAT(FLOOR(EXTRACT(EPOCH FROM (valid_until - NOW())) / 86400), ' days left')
        WHEN EXTRACT(EPOCH FROM (valid_until - NOW())) > 3600 THEN
            CONCAT(FLOOR(EXTRACT(EPOCH FROM (valid_until - NOW())) / 3600), ' hours left')
        ELSE
            'Less than 1 hour left'
    END AS time_remaining,
    CASE 
        WHEN is_festival = true THEN true
        WHEN EXTRACT(EPOCH FROM (valid_until - NOW())) < 172800 THEN true -- < 2 days
        ELSE false
    END AS should_blink
FROM discounts 
WHERE 
    is_active = true 
    AND valid_until > NOW();
```

## 📈 Data Pagination & Analytics

### Standard Pagination Query Pattern
```sql
-- Generic pagination function
CREATE OR REPLACE FUNCTION paginate_query(
    base_query TEXT,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    order_by TEXT DEFAULT 'created_at DESC'
)
RETURNS JSON AS $$
DECLARE
    offset_val INTEGER;
    total_count INTEGER;
    result JSON;
BEGIN
    offset_val := (page_num - 1) * page_size;
    
    -- Get total count
    EXECUTE 'SELECT COUNT(*) FROM (' || base_query || ') as count_query' INTO total_count;
    
    -- Get paginated results
    EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || 
            base_query || ' ORDER BY ' || order_by || 
            ' LIMIT ' || page_size || ' OFFSET ' || offset_val || ') t' INTO result;
    
    RETURN json_build_object(
        'data', COALESCE(result, '[]'::json),
        'pagination', json_build_object(
            'currentPage', page_num,
            'totalPages', CEIL(total_count::DECIMAL / page_size),
            'totalItems', total_count,
            'itemsPerPage', page_size,
            'hasNextPage', (page_num * page_size) < total_count,
            'hasPreviousPage', page_num > 1
        )
    );
END;
$$ LANGUAGE plpgsql;
```

### Analytics Queries
```sql
-- Revenue analytics
CREATE VIEW revenue_analytics AS
SELECT 
    DATE_TRUNC('month', appointment_date) as month,
    COUNT(*) as total_appointments,
    SUM(total_amount) as total_revenue,
    SUM(discount_amount) as total_discounts,
    AVG(total_amount) as average_ticket_size
FROM appointments 
WHERE status = 'completed' 
GROUP BY DATE_TRUNC('month', appointment_date);

-- Customer analytics
CREATE VIEW customer_analytics AS
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name as full_name,
    u.status,
    COUNT(a.id) as total_appointments,
    SUM(a.total_amount) as total_spent,
    AVG(r.rating) as average_rating,
    MAX(a.appointment_date) as last_visit
FROM users u
LEFT JOIN appointments a ON u.id = a.customer_id AND a.status = 'completed'
LEFT JOIN reviews r ON u.id = r.customer_id
WHERE u.user_type = 'customer'
GROUP BY u.id, u.first_name, u.last_name, u.status;
```

## 🔒 Security & Row Level Security (RLS)

### Enable RLS on Tables
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

### RLS Policies
```sql
-- Users can only see their own data
CREATE POLICY user_own_data ON users
    FOR ALL 
    USING (id = current_setting('app.current_user_id')::UUID)
    WITH CHECK (id = current_setting('app.current_user_id')::UUID);

-- Admin can see all users
CREATE POLICY admin_all_users ON users
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.current_user_id')::UUID 
            AND user_type = 'admin'
        )
    );

-- Customers can see their own appointments
CREATE POLICY customer_own_appointments ON appointments
    FOR ALL 
    USING (customer_id = current_setting('app.current_user_id')::UUID);

-- Staff can see appointments assigned to them
CREATE POLICY staff_assigned_appointments ON appointments
    FOR ALL 
    USING (
        staff_id = current_setting('app.current_user_id')::UUID 
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.current_user_id')::UUID 
            AND user_type IN ('admin', 'staff')
        )
    );
```

## 📊 Real-time Features with PostgreSQL

### LISTEN/NOTIFY for Real-time Updates
```sql
-- Function to notify on appointment changes
CREATE OR REPLACE FUNCTION notify_appointment_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('appointment_changes', 
        json_build_object(
            'action', TG_OP,
            'appointment_id', COALESCE(NEW.id, OLD.id),
            'customer_id', COALESCE(NEW.customer_id, OLD.customer_id),
            'status', COALESCE(NEW.status, OLD.status)
        )::text
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for appointment notifications
CREATE TRIGGER appointment_change_notify
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW 
    EXECUTE FUNCTION notify_appointment_change();
```

## 🚀 Performance Optimization

### Essential Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_appointments_customer_date ON appointments(customer_id, appointment_date);
CREATE INDEX idx_appointments_staff_date ON appointments(staff_id, appointment_date);
CREATE INDEX idx_services_category_active ON services(category_id, is_active);
CREATE INDEX idx_discounts_active_tier ON discounts(is_active, customer_tier);

-- Partial indexes for better performance
CREATE INDEX idx_active_appointments ON appointments(appointment_date) 
    WHERE status IN ('pending', 'confirmed');
CREATE INDEX idx_featured_reviews ON reviews(display_order) 
    WHERE is_featured = true AND is_approved = true;
```

### Query Optimization
```sql
-- Use EXPLAIN ANALYZE for query optimization
EXPLAIN ANALYZE 
SELECT s.name, s.current_price, sc.name as category_name
FROM services s
JOIN service_categories sc ON s.category_id = sc.id
WHERE s.is_active = true
ORDER BY s.display_order;
```

## 📋 Migration Scripts

### Initial Setup Script
```sql
-- Create database
CREATE DATABASE looksnlove_salon;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Run all table creation scripts in order:
-- 1. service_categories
-- 2. discounts
-- 3. users
-- 4. services
-- 5. appointments
-- 6. appointment_services
-- 7. reviews

-- Create indexes, triggers, and views
-- Set up RLS policies
-- Insert seed data
```

### Sample Data Insertion
```sql
-- Insert sample service categories
INSERT INTO service_categories (name, description, icon, color) VALUES
('Hair Services', 'Professional hair styling and coloring', 'scissors', '#e91e63'),
('Nail Care', 'Manicure and pedicure services', 'hand', '#9c27b0'),
('Facial Treatments', 'Skincare and facial services', 'smile', '#2196f3'),
('Spa Services', 'Relaxation and wellness treatments', 'leaf', '#4caf50');

-- Insert sample services
INSERT INTO services (name, description, category_id, duration_minutes, base_price, current_price) VALUES
('Hair Styling', 'Professional hair cut and styling', 
 (SELECT id FROM service_categories WHERE name = 'Hair Services'), 60, 50.00, 50.00),
('Facial Treatment', 'Deep cleansing facial treatment', 
 (SELECT id FROM service_categories WHERE name = 'Facial Treatments'), 90, 80.00, 80.00);
```

## 🔄 Complete System Data Flows

### 1. User Registration & Authentication Flow
```
Frontend → Backend → Database
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Registration    │    │ POST /auth/      │    │ INSERT users    │
│ Form           │ ──→│ register         │ ──→│ email_verified  │
│ (UserLayout)   │    │ Password hash    │    │ = false         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Email Verify    │    │ POST /auth/      │    │ UPDATE users    │
│ Component      │ ←──│ verify-email     │ ←──│ email_verified  │
│ (Toast Update) │    │ JWT Token        │    │ = true          │
└─────────────────┘    └──────────────────┘    └─────────────────┘

Tables Affected: users
UI Components: UserLayout, Login/Register Modals, Toast notifications
Real-time Updates: User status changes via LISTEN/NOTIFY
```

### 2. Service Booking Flow
```
Frontend → Backend → Database → UI Updates
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ UserServices    │    │ POST /api/       │    │ INSERT          │
│ BookingModal    │ ──→│ appointments     │ ──→│ appointments    │
│ Date/Time Pick  │    │ Validate slots   │    │ appointment_    │
└─────────────────┘    └──────────────────┘    │ services        │
                                              └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ UserAppointments│    │ Real-time notify │    │ UPDATE users    │
│ UserDashboard   │ ←──│ pg_notify()      │ ←──│ loyalty_points  │
│ AdminAppointments│   │ appointment_     │    │ total_spent     │
└─────────────────┘    │ changes          │    └─────────────────┘

Tables Affected: appointments, appointment_services, users, services
UI Components: UserServices, UserAppointments, UserDashboard, AdminAppointments
Real-time Updates: Appointment notifications to admin dashboard
```

### 3. **Admin Discount Management Flow** (Key Feature)
```
Frontend → Backend → Database → Automatic Price Updates → UI Reflection
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ DiscountMgmt    │    │ POST /api/       │    │ INSERT discounts│
│ Admin Create    │ ──→│ discounts        │ ──→│ is_active=false │
│ (Draft Mode)    │    │ (Admin Only)     │    │ (Hidden)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Discount Toggle │    │ PUT /api/        │    │ UPDATE discounts│
│ (Activate)      │ ──→│ discounts/:id/   │ ──→│ is_active=true  │
│ Admin Control   │    │ activate         │    │ TRIGGER FIRES   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓
                    ┌──────────────────┐    ┌─────────────────┐
                    │ AUTO TRIGGER:    │    │ UPDATE services │
                    │ update_service_  │ ──→│ current_price   │
                    │ prices_on_       │    │ applied_discount│
                    │ discount_change()│    │ price_updated_at│
                    └──────────────────┘    └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Homepage        │    │ GET /api/public/ │    │ SELECT FROM     │
│ UserDashboard   │ ←──│ discounts/active │ ←──│ active_discounts│
│ UserServices    │    │ Real-time prices │    │ _with_timing    │
│ **BLINKING**    │    │ with discounts   │    │ (VIEW)          │
└─────────────────┘    └──────────────────┘    └─────────────────┘

Tables Affected: discounts, services, appointments
UI Components: DiscountManagement, Homepage, UserDashboard, UserServices
Real-time Updates: Price changes reflect immediately across all components
**Special Feature**: Festival discounts trigger blinking animations
```

### 4. Review & Rating Management Flow
```
Frontend → Backend → Database → Admin Approval → Public Display
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ ReviewModal     │    │ POST /api/       │    │ INSERT reviews  │
│ (After Appt)    │ ──→│ reviews          │ ──→│ is_approved=    │
│ Rating 1-5      │    │ Customer submits │    │ false (pending) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ CustomerReviews │    │ PUT /api/reviews/│    │ UPDATE reviews  │
│ Admin Panel     │ ──→│ :id/approve      │ ──→│ is_approved=true│
│ Approve/Reject  │    │ (Admin only)     │    │ is_featured=?   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Homepage        │    │ GET /api/reviews/│    │ SELECT FROM     │
│ Review Carousel │ ←──│ featured         │ ←──│ reviews WHERE   │
│ Star Ratings    │    │ Public display   │    │ is_approved AND │
└─────────────────┘    └──────────────────┘    │ is_featured     │

Tables Affected: reviews, appointments, users
UI Components: ReviewModal, CustomerReviews, Homepage, RatingGrid
Admin Controls: Approval workflow, featured selection
```

### 5. Customer Management & VIP System Flow
```
Frontend → Backend → Database → Tier Benefits → UI Updates
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ CustomersManagement│  │ PUT /api/       │    │ UPDATE users    │
│ Admin Panel     │ ──→│ customers/:id/   │ ──→│ status = 'vip'  │
│ Set VIP Status  │    │ status           │    │ tier upgrade    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ UserDashboard   │    │ GET /api/        │    │ SELECT discounts│
│ VIP Discounts   │ ←──│ discounts/active/│ ←──│ WHERE customer_ │
│ Exclusive Offers│    │ vip              │    │ tier IN ('all', │
└─────────────────┘    └──────────────────┘    │ 'vip')          │

Tables Affected: users, discounts, appointments
UI Components: CustomersManagement, UserDashboard, UserServices
Benefits: VIP-exclusive discounts, priority booking
```

## 📋 Complete API Documentation

### 🔐 Authentication & User Management APIs

#### Authentication Endpoints
```
POST   /auth/register
Body: { email, password, firstName, lastName, phone, dateOfBirth, gender, address }
Response: { user, accessToken, refreshToken }

POST   /auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }

POST   /auth/logout
Headers: { Authorization: Bearer <token> }
Response: { message: "Logged out successfully" }

POST   /auth/refresh-token
Body: { refreshToken }
Response: { accessToken }

POST   /auth/forgot-password
Body: { email }
Response: { message: "Reset link sent" }

POST   /auth/reset-password
Body: { token, newPassword }
Response: { message: "Password reset successful" }

POST   /auth/verify-email
Body: { token }
Response: { message: "Email verified" }

GET    /auth/profile
Headers: { Authorization: Bearer <token> }
Response: { user }

PUT    /auth/profile
Headers: { Authorization: Bearer <token> }
Body: { firstName, lastName, phone, address, preferences }
Response: { user }
```

#### Customer Management APIs (Admin Only)
```
GET    /api/customers
Query: { page, limit, search, status, sortBy, sortOrder }
Response: { data: [customers], pagination: {...} }

POST   /api/customers
Body: { email, firstName, lastName, phone, address, status }
Response: { customer }

GET    /api/customers/:id
Response: { customer, appointments, reviews, stats }

PUT    /api/customers/:id
Body: { firstName, lastName, phone, address, preferences }
Response: { customer }

DELETE /api/customers/:id
Response: { message: "Customer deleted" }

PUT    /api/customers/:id/status
Body: { status: 'active' | 'inactive' | 'suspended' | 'vip' }
Response: { customer }

GET    /api/customers/stats
Response: { 
  total, active, vip, totalRevenue, 
  avgTicketSize, topCustomers 
}

PUT    /api/customers/:id/loyalty-points
Body: { points, action: 'add' | 'subtract' | 'set' }
Response: { customer }
```

### 🎨 Service Management APIs

#### Service Categories
```
GET    /api/service-categories
Response: { categories }

POST   /api/service-categories (Admin)
Body: { name, description, icon, color, displayOrder }
Response: { category }

PUT    /api/service-categories/:id (Admin)
Body: { name, description, icon, color, displayOrder, isActive }
Response: { category }

DELETE /api/service-categories/:id (Admin)
Response: { message: "Category deleted" }

PUT    /api/service-categories/reorder (Admin)
Body: { categoryIds: [uuid] }
Response: { message: "Order updated" }
```

#### Services Management
```
GET    /api/services
Query: { category, isActive, isPopular, search }
Response: { services }

POST   /api/services (Admin)
Body: { 
  name, description, categoryId, durationMinutes, 
  basePrice, imageUrl, requirements, preparationNotes, 
  aftercareInstructions, tags, isPopular 
}
Response: { service }

PUT    /api/services/:id (Admin)
Body: { name, description, basePrice, isActive, isPopular, ... }
Response: { service }

DELETE /api/services/:id (Admin)
Response: { message: "Service deleted" }

GET    /api/services/pricing/:customerTier
Response: { services with tier-specific pricing }

PUT    /api/services/reorder (Admin)
Body: { serviceIds: [uuid] }
Response: { message: "Order updated" }

POST   /api/services/calculate-price
Body: { serviceIds: [uuid], customerId?, discountCode? }
Response: { 
  originalTotal, discountAmount, finalTotal, 
  appliedDiscounts, breakdown 
}
```

### 💰 **Admin-Controlled Discount System APIs**

#### Discount Management (Admin Only)
```
GET    /api/discounts
Query: { page, limit, isActive, discountType, search }
Response: { data: [discounts], pagination: {...} }

POST   /api/discounts
Body: { 
  name, description, discountType, discountValue, 
  applicableServices, customerTier, validFrom, validUntil, 
  isFestival, usageLimit 
}
Response: { discount }
Note: Created with is_active = false (draft mode)

PUT    /api/discounts/:id
Body: { name, description, validUntil, usageLimit, ... }
Response: { discount }

DELETE /api/discounts/:id
Response: { message: "Discount deleted" }

PUT    /api/discounts/:id/activate
Body: {}
Response: { discount }
Effect: Triggers automatic service price updates

PUT    /api/discounts/:id/deactivate
Body: {}
Response: { discount }
Effect: Resets service prices to base prices

GET    /api/discounts/analytics
Response: { 
  totalDiscounts, activeDiscounts, totalSavings, 
  popularDiscounts, usageStats 
}

POST   /api/discounts/bulk-activate
Body: { discountIds: [uuid] }
Response: { message: "Discounts activated" }

POST   /api/discounts/bulk-deactivate
Body: { discountIds: [uuid] }
Response: { message: "Discounts deactivated" }
```

#### **Customer-Facing Discount APIs** (Only Active Discounts)
```
GET    /api/public/discounts/active
Query: { customerTier: 'all' | 'vip' | 'regular' }
Response: { 
  discounts with timeRemaining, shouldBlink, 
  applicable services, savings amount 
}

GET    /api/user/discounts/active
Headers: { Authorization: Bearer <token> }
Response: { 
  personalizedDiscounts based on user tier,
  recommendedServices, potentialSavings 
}

POST   /api/discounts/validate
Body: { discountCode?, serviceIds: [uuid], customerId? }
Response: { 
  isValid, discount, applicableServices, 
  totalSavings, finalAmount 
}
```

### 📅 Appointment Management APIs

#### Appointment Booking & Management
```
GET    /api/appointments
Query: { 
  customerId?, staffId?, status?, date?, 
  page, limit, sortBy, sortOrder 
}
Response: { data: [appointments], pagination: {...} }

POST   /api/appointments
Body: { 
  customerId, serviceIds: [uuid], appointmentDate, 
  startTime, staffId?, discountId?, notes, 
  depositAmount? 
}
Response: { appointment }
Effect: Updates user loyalty points and total spent

GET    /api/appointments/:id
Response: { 
  appointment, customer, services, staff, 
  discount, paymentHistory 
}

PUT    /api/appointments/:id
Body: { 
  appointmentDate?, startTime?, status?, 
  staffId?, notes?, paymentStatus? 
}
Response: { appointment }

DELETE /api/appointments/:id
Body: { cancellationReason }
Response: { message: "Appointment cancelled" }

GET    /api/appointments/calendar
Query: { startDate, endDate, staffId?, view: 'day'|'week'|'month' }
Response: { 
  appointments, availability, 
  conflicts, suggestions 
}

GET    /api/appointments/availability
Query: { date, duration, staffId? }
Response: { availableSlots: [timeSlots] }

PUT    /api/appointments/:id/status
Body: { status, notes? }
Response: { appointment }
Effect: May trigger review request for completed appointments

POST   /api/appointments/:id/reschedule
Body: { newDate, newTime, reason }
Response: { appointment }

GET    /api/appointments/upcoming
Headers: { Authorization: Bearer <token> }
Response: { appointments for current user }

POST   /api/appointments/:id/send-reminder
Response: { message: "Reminder sent" }
```

### ⭐ Reviews & Ratings APIs

#### Review Management
```
GET    /api/reviews
Query: { 
  customerId?, appointmentId?, rating?, 
  isApproved?, isFeatured?, page, limit 
}
Response: { data: [reviews], pagination: {...} }

POST   /api/reviews
Body: { 
  customerId, appointmentId?, rating, title?, 
  comment, reviewType: 'website'|'google'|'facebook' 
}
Response: { review }
Note: Created with is_approved = false

GET    /api/reviews/:id
Response: { review, customer, appointment }

PUT    /api/reviews/:id
Body: { title, comment, rating }
Response: { review }
Restriction: Only by review author

DELETE /api/reviews/:id
Response: { message: "Review deleted" }

PUT    /api/reviews/:id/approve (Admin)
Body: { isApproved: boolean, isFeatured?: boolean }
Response: { review }

PUT    /api/reviews/:id/respond (Admin)
Body: { responseText }
Response: { review }

GET    /api/reviews/featured
Response: { reviews for homepage display }

GET    /api/reviews/stats
Response: { 
  averageRating, totalReviews, ratingDistribution, 
  recentReviews, improvementAreas 
}

POST   /api/reviews/bulk-approve (Admin)
Body: { reviewIds: [uuid], isApproved: boolean }
Response: { message: "Reviews updated" }

GET    /api/reviews/pending (Admin)
Response: { pendingReviews }
```

### 📊 Analytics & Reporting APIs

#### Business Analytics (Admin Only)
```
GET    /api/analytics/dashboard
Response: { 
  totalRevenue, totalAppointments, averageRating, 
  activeCustomers, popularServices, revenueGrowth,
  appointmentTrends, customerRetention 
}

GET    /api/analytics/revenue
Query: { startDate, endDate, groupBy: 'day'|'week'|'month' }
Response: { 
  revenueData, discountImpact, serviceBreakdown,
  paymentMethodStats, refunds 
}

GET    /api/analytics/customers
Query: { startDate, endDate }
Response: { 
  newCustomers, returningCustomers, churnRate,
  vipConversions, loyaltyPointsDistribution 
}

GET    /api/analytics/services
Query: { startDate, endDate }
Response: { 
  popularServices, revenueByService, 
  serviceUtilization, averageDuration 
}

GET    /api/analytics/staff
Query: { startDate, endDate }
Response: { 
  staffPerformance, appointmentsPerStaff,
  customerRatings, revenue contribution 
}

GET    /api/analytics/discounts
Response: { 
  discountUsage, savingsProvided, 
  popularDiscounts, conversionRates 
}

POST   /api/analytics/export
Body: { 
  reportType: 'revenue'|'customers'|'appointments',
  startDate, endDate, format: 'csv'|'excel'|'pdf' 
}
Response: { downloadUrl }
```

### 🔔 Notification & Communication APIs

#### Notification Management
```
GET    /api/notifications
Headers: { Authorization: Bearer <token> }
Response: { notifications, unreadCount }

PUT    /api/notifications/:id/read
Response: { notification }

POST   /api/notifications/mark-all-read
Response: { message: "All notifications marked as read" }

POST   /api/notifications/send (Admin)
Body: { 
  type: 'appointment'|'promotion'|'reminder',
  recipients: [userId], title, message, 
  scheduledFor?, actionUrl? 
}
Response: { notification }

GET    /api/notifications/templates (Admin)
Response: { emailTemplates, smsTemplates }

PUT    /api/notifications/preferences
Body: { 
  emailNotifications: boolean, 
  smsNotifications: boolean,
  promotionalEmails: boolean 
}
Response: { preferences }
```

### 📁 File Upload & Media APIs

#### File Management
```
POST   /api/upload/profile-image
Body: FormData with image file
Response: { imageUrl }

POST   /api/upload/service-image
Body: FormData with image file
Response: { imageUrl }

DELETE /api/upload/:filename
Response: { message: "File deleted" }

GET    /api/media/gallery
Response: { images categorized by type }
```

### 🛠️ System Configuration APIs (Admin)

#### System Settings
```
GET    /api/settings/business
Response: { 
  businessHours, holidays, bookingRules,
  cancellationPolicy, deposits 
}

PUT    /api/settings/business
Body: { businessHours, holidays, bookingRules }
Response: { settings }

GET    /api/settings/payments
Response: { 
  acceptedMethods, depositRules, 
  refundPolicy, processingFees 
}

PUT    /api/settings/payments
Body: { acceptedMethods, depositRules }
Response: { settings }

GET    /api/settings/notifications
Response: { 
  emailTemplates, smsTemplates, 
  reminderSettings, automations 
}

PUT    /api/settings/notifications
Body: { emailTemplates, reminderSettings }
Response: { settings }
```

## 🔄 Real-time WebSocket Events

### Client-Server Events
```javascript
// Appointment changes (for admin dashboard)
socket.on('appointment:created', (appointment) => {
  // Update admin appointment list
});

socket.on('appointment:updated', (appointment) => {
  // Update specific appointment in UI
});

socket.on('appointment:cancelled', (appointmentId) => {
  // Remove from UI or mark as cancelled
});

// Discount activations (for customer interfaces)
socket.on('discount:activated', (discount) => {
  // Show new discount banner
  // Update service prices
  // Trigger blinking animation if festival
});

socket.on('discount:deactivated', (discountId) => {
  // Remove discount banner
  // Reset service prices
});

// Review approvals (for public display)
socket.on('review:approved', (review) => {
  // Add to featured reviews
  // Update average rating
});

// System notifications
socket.on('notification:new', (notification) => {
  // Show toast notification
  // Update notification badge
});
```

This comprehensive PostgreSQL database design with complete API documentation provides a robust, scalable foundation for the LooksNLove salon application with proper relationships, indexes, security, real-time capabilities, and admin-controlled discount management.