# FOOD DELIVERY APP - CLAUDE CODE DEVELOPMENT GUIDE
## Restaurant & Food Ordering Mobile Application - Complete Implementation Roadmap

---

## 📋 DOCUMENT PURPOSE

This guide is designed for **non-technical founders** building a Food Delivery Mobile App using **Claude Code** through prompts only.

**Product Type:** Mobile Food Delivery App (iOS + Android)  
**Core Value:** Browse restaurants, order food, track delivery  
**Target:** Hungry users ordering food from local restaurants  
**Timeline:** 3-4 weeks to MVP  

Every technical decision has been made. Follow this document step-by-step.

---

## 🎯 PROJECT OVERVIEW

**Product:** Food Delivery Mobile App  
**Category:** On-Demand Food Delivery  
**One-Line Value:** "Order your favorite food with a few taps"

**Core User Flow:**
```
Open App 
  → Browse Categories/Restaurants 
    → Select Food Items 
      → Add to Cart 
        → Checkout 
          → Track Order
```

**MVP Features (Version 1):**
1. 🏠 **Home Screen** - Featured restaurants, categories
2. 🍕 **Restaurant Menu** - Browse food items with images
3. 🛒 **Cart Management** - Add/remove items, quantity
4. ⭐ **Favorites** - Save favorite restaurants/dishes
5. 📦 **Order Tracking** - View order status
6. 👤 **User Profile** - Account management
7. 🔍 **Search & Filters** - Find restaurants, cuisines

**NOT in MVP:**
- ❌ Real-time delivery tracking (Phase 2)
- ❌ Payment gateway integration (cash on delivery only)
- ❌ Restaurant dashboard (separate app)
- ❌ Driver/Courier app (separate)
- ❌ Live chat support

**IS:**
✅ Clean UI with food imagery  
✅ Smooth navigation  
✅ Cart management  
✅ Order history  
✅ Favorites system  
✅ Search functionality  

---

## 🏗 ARCHITECTURE PHILOSOPHY

### Why Mobile-First?

**Problem:**
- Users order food on-the-go
- Need quick browsing experience
- Visual appeal critical (food photos)
- Notifications important

**Solution:**
- Native-like mobile app
- Image-heavy design
- Fast performance
- Push notifications ready

### Based on UI Screenshots:

**Observed Screens:**
1. **Home:** Grid/list of food items with images
2. **Categories:** Filters tab, Favorites tab
3. **Detail:** Large food image, description, add to cart
4. **Restaurant List:** Multiple restaurants
5. **Dark/Light Mode:** Both themes visible

---

## 🛠 FINAL TECH STACK DECISIONS

### ✅ RECOMMENDED STACK

| Component | Technology | Why |
|-----------|-----------|-----|
| **Framework** | React Native + Expo | Cross-platform, fast dev |
| **Language** | TypeScript | Type safety |
| **Navigation** | Expo Router | File-based routing |
| **UI Library** | React Native Paper + Custom | Material Design + branded |
| **State Management** | Zustand | Lightweight, simple |
| **Backend** | Supabase | Auth, database, storage |
| **Database** | PostgreSQL (Supabase) | Relational data |
| **Image Storage** | Supabase Storage | Food images |
| **Maps** | React Native Maps | Restaurant locations |
| **Notifications** | Expo Notifications | Order updates |
| **Icons** | Expo Vector Icons | Rich icon set |
| **Image Handling** | expo-image | Optimized images |
| **Local Storage** | AsyncStorage + MMKV | Cart persistence |

### Why This Stack?

**React Native + Expo:**
- Cross-platform (iOS + Android)
- Fast development
- Good for image-heavy apps
- Easy deployment

**Supabase:**
- User accounts
- Restaurant data
- Menu items
- Orders storage
- Real-time updates
- Image storage for food photos

---

## 📁 PROJECT STRUCTURE

```
food-delivery-app/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Bottom tabs
│   │   ├── index.tsx             # Home
│   │   ├── search.tsx            # Search
│   │   ├── favorites.tsx         # Favorites
│   │   ├── orders.tsx            # Order History
│   │   └── profile.tsx           # Profile
│   ├── restaurant/
│   │   └── [id].tsx              # Restaurant Detail
│   ├── food/
│   │   └── [id].tsx              # Food Item Detail
│   ├── cart.tsx                  # Cart Screen
│   ├── checkout.tsx              # Checkout
│   ├── order-tracking/
│   │   └── [id].tsx              # Track Order
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── src/
│   ├── components/               # Reusable components
│   │   ├── home/
│   │   │   ├── CategoryList.tsx
│   │   │   ├── FeaturedRestaurants.tsx
│   │   │   └── PopularFoods.tsx
│   │   ├── restaurant/
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── MenuCategory.tsx
│   │   │   └── FoodItemCard.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── EmptyCart.tsx
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── ui/                   # shadcn-style components
│   ├── services/                 # Business logic
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   ├── restaurants/
│   │   │   └── restaurant-service.ts
│   │   ├── cart/
│   │   │   └── cart-service.ts
│   │   ├── orders/
│   │   │   └── order-service.ts
│   │   └── favorites/
│   │       └── favorites-service.ts
│   ├── store/                    # Zustand stores
│   │   ├── cartStore.ts
│   │   ├── userStore.ts
│   │   ├── favoritesStore.ts
│   │   └── orderStore.ts
│   ├── types/                    # TypeScript types
│   │   ├── restaurant.ts
│   │   ├── food.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── user.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── categories.ts
│   │   └── config.ts
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
├── assets/                       # Static files
│   ├── fonts/
│   ├── images/
│   └── icons/
├── supabase/                     # Supabase setup
│   ├── migrations/
│   └── seed.sql
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🗄 DATABASE SCHEMA (Supabase)

### Complete Database Design

```sql
-- ========== USERS ==========
-- (Managed by Supabase Auth)

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- 'Home', 'Work', etc.
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== RESTAURANTS ==========

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cover_image_url TEXT,
  category TEXT NOT NULL, -- 'Pizza', 'Burger', 'Asian', etc.
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  delivery_time TEXT, -- '20-30 min'
  delivery_fee DECIMAL(10, 2),
  minimum_order DECIMAL(10, 2),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  is_open BOOLEAN DEFAULT TRUE,
  opening_hours JSONB, -- { "monday": "09:00-22:00", ... }
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== MENU ==========

CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- For discounts
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  popular BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE food_item_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL, -- 'Size', 'Extras', 'Sauce'
  option_values JSONB NOT NULL, -- [{"name": "Small", "price": 0}, {"name": "Large", "price": 2}]
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== FAVORITES ==========

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT one_favorite_type CHECK (
    (restaurant_id IS NOT NULL AND food_item_id IS NULL) OR
    (restaurant_id IS NULL AND food_item_id IS NOT NULL)
  )
);

-- ========== ORDERS ==========

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'on_the_way',
  'delivered',
  'cancelled'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  delivery_address JSONB NOT NULL, -- Full address object
  payment_method TEXT NOT NULL, -- 'cash', 'card', 'wallet'
  special_instructions TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
  food_item_name TEXT NOT NULL, -- Snapshot in case item deleted
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  selected_options JSONB, -- User's selected options
  special_request TEXT,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========

CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_featured ON restaurants(featured);
CREATE INDEX idx_food_items_restaurant ON food_items(restaurant_id);
CREATE INDEX idx_food_items_popular ON food_items(popular);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ========== RLS POLICIES ==========

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view/edit own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can manage own addresses
CREATE POLICY "Users can manage own addresses"
  ON user_addresses FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage own favorites
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- Users can view own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read for restaurants and menu
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurants"
  ON restaurants FOR SELECT
  TO authenticated, anon
  USING (TRUE);

CREATE POLICY "Anyone can view food items"
  ON food_items FOR SELECT
  TO authenticated, anon
  USING (TRUE);
```

### TypeScript Types

```typescript
// src/types/restaurant.ts

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  cover_image_url?: string;
  category: string;
  rating: number;
  review_count: number;
  delivery_time?: string;
  delivery_fee: number;
  minimum_order: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  is_open: boolean;
  opening_hours?: Record<string, string>;
  featured: boolean;
  created_at: string;
}

export interface FoodItem {
  id: string;
  restaurant_id: string;
  category_id?: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  is_available: boolean;
  popular: boolean;
  rating: number;
  review_count: number;
  restaurant?: Restaurant;
}

export interface CartItem {
  id: string; // unique cart item id
  food_item: FoodItem;
  quantity: number;
  selected_options?: Record<string, any>;
  special_request?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  delivery_address: any;
  payment_method: string;
  special_instructions?: string;
  estimated_delivery_time?: string;
  created_at: string;
  restaurant?: Restaurant;
  items?: OrderItem[];
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id?: string;
  food_item_name: string;
  quantity: number;
  unit_price: number;
  selected_options?: any;
  special_request?: string;
  subtotal: number;
}
```

---

## 🚀 IMPLEMENTATION ROADMAP

### STAGE 1: PROJECT SETUP (Day 1)

**Prompt to Claude Code:**

```
Create React Native + Expo app for Food Delivery application.

Requirements:
1. Initialize Expo project with TypeScript:
   npx create-expo-app food-delivery-app --template expo-template-blank-typescript

2. Install dependencies:
   - expo-router
   - @supabase/supabase-js
   - zustand
   - react-native-paper
   - @react-native-async-storage/async-storage
   - react-native-mmkv
   - expo-image
   - expo-vector-icons
   - react-native-maps
   - expo-notifications
   - expo-location
   - date-fns

3. Set up folder structure from FOOD_DELIVERY_CLAUDE_CODE_GUIDE.md

4. Configure app.json:
   - App name: "FoodDelivery" (or creative name)
   - Bundle ID: com.fooddelivery.app
   - Permissions: location, notifications
   - Orientation: portrait

5. Create .env:
   - EXPO_PUBLIC_SUPABASE_URL
   - EXPO_PUBLIC_SUPABASE_ANON_KEY

6. Set up TypeScript configuration

Create comprehensive README with setup instructions.
```

---

### STAGE 2: SUPABASE SETUP (Day 1-2)

**Prompt to Claude Code:**

```
Set up Supabase backend for Food Delivery App.

1. Create Supabase project:
   - Project name: food-delivery
   - Region: closest to users
   - Strong database password

2. Run SQL from FOOD_DELIVERY_CLAUDE_CODE_GUIDE.md:
   - All table definitions
   - Indexes
   - RLS policies
   
3. Set up Storage buckets:
   - Bucket: 'restaurant-images' (public)
   - Bucket: 'food-images' (public)
   - Bucket: 'avatars' (private)

4. Create Supabase client (src/services/supabase/client.ts):
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
   const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   
   // Helper functions
   export async function getRestaurants() {
     const { data, error } = await supabase
       .from('restaurants')
       .select('*')
       .eq('is_open', true)
       .order('featured', { ascending: false });
     
     if (error) throw error;
     return data;
   }
   
   export async function getFoodItems(restaurantId: string) {
     const { data, error } = await supabase
       .from('food_items')
       .select('*')
       .eq('restaurant_id', restaurantId)
       .eq('is_available', true);
     
     if (error) throw error;
     return data;
   }
   ```

5. Seed sample data:
   - 5-10 restaurants
   - 20-30 food items
   - Upload sample food images

Test: Query restaurants → verify data returned
```

---

### STAGE 3: AUTHENTICATION (Day 2)

**Prompt to Claude Code:**

```
Implement authentication for Food Delivery App.

1. Auth screens (app/(auth)/):
   
   login.tsx:
   - Email + password form
   - "Sign up" link
   - Social login buttons (Google, Apple) - optional
   - Form validation
   
   register.tsx:
   - Full name, email, password, phone
   - Terms acceptance
   - Auto-create user_profile after signup

2. User Store (src/store/userStore.ts):
   ```typescript
   import create from 'zustand';
   import { supabase } from '../services/supabase/client';
   
   interface UserState {
     user: any | null;
     profile: any | null;
     loading: boolean;
     signIn: (email: string, password: string) => Promise<void>;
     signUp: (data: any) => Promise<void>;
     signOut: () => Promise<void>;
     loadProfile: () => Promise<void>;
   }
   
   export const useUserStore = create<UserState>((set) => ({
     user: null,
     profile: null,
     loading: false,
     
     signIn: async (email, password) => {
       set({ loading: true });
       const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
       
       if (error) throw error;
       
       set({ user: data.user, loading: false });
       await useUserStore.getState().loadProfile();
     },
     
     signUp: async ({ email, password, full_name, phone }) => {
       set({ loading: true });
       
       const { data, error } = await supabase.auth.signUp({
         email,
         password,
       });
       
       if (error) throw error;
       
       // Create profile
       await supabase.from('user_profiles').insert({
         id: data.user!.id,
         full_name,
         phone,
       });
       
       set({ user: data.user, loading: false });
     },
     
     signOut: async () => {
       await supabase.auth.signOut();
       set({ user: null, profile: null });
     },
     
     loadProfile: async () => {
       const { data: { user } } = await supabase.auth.getUser();
       
       if (user) {
         const { data: profile } = await supabase
           .from('user_profiles')
           .select('*')
           .eq('id', user.id)
           .single();
         
         set({ profile });
       }
     },
   }));
   ```

3. Protected routes:
   - Check auth state in _layout.tsx
   - Redirect to login if not authenticated

Test: Sign up → login → profile created → access protected screens
```

---

### STAGE 4: HOME SCREEN (Day 2-3)

**Prompt to Claude Code:**

```
Build Home screen for Food Delivery App.

Based on UI screenshots, implement:

1. Home Screen (app/(tabs)/index.tsx):
   
   Layout:
   ```
   ┌────────────────────────────────────┐
   │  Header (Location + Search)        │
   ├────────────────────────────────────┤
   │  Categories (Horizontal Scroll)    │
   ├────────────────────────────────────┤
   │  Featured Restaurants              │
   │  ┌──────┐ ┌──────┐ ┌──────┐        │
   │  │ Img  │ │ Img  │ │ Img  │        │
   │  │ Name │ │ Name │ │ Name │        │
   │  └──────┘ └──────┘ └──────┘        │
   ├────────────────────────────────────┤
   │  Popular Foods (Grid)              │
   │  ┌─────┬─────┐ ┌─────┬─────┐       │
   │  │ Img │     │ │ Img │     │       │
   │  ├─────┴─────┤ ├─────┴─────┤       │
   │  │  Name     │ │  Name     │       │
   │  │  Price    │ │  Price    │       │
   │  └───────────┘ └───────────┘       │
   └────────────────────────────────────┘
   ```

2. Components:
   
   CategoryList.tsx:
   ```typescript
   const categories = [
     { id: '1', name: 'Pizza', icon: '🍕', color: '#FF6B6B' },
     { id: '2', name: 'Burger', icon: '🍔', color: '#4ECDC4' },
     { id: '3', name: 'Asian', icon: '🍜', color: '#FFD93D' },
     { id: '4', name: 'Sushi', icon: '🍣', color: '#6BCB77' },
     { id: '5', name: 'Dessert', icon: '🍰', color: '#FF9FF3' },
   ];
   
   export function CategoryList() {
     return (
       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
         {categories.map(cat => (
           <TouchableOpacity
             key={cat.id}
             style={styles.categoryCard}
           >
             <View style={[styles.iconCircle, { backgroundColor: cat.color }]}>
               <Text style={styles.emoji}>{cat.icon}</Text>
             </View>
             <Text style={styles.categoryName}>{cat.name}</Text>
           </TouchableOpacity>
         ))}
       </ScrollView>
     );
   }
   ```
   
   RestaurantCard.tsx:
   ```typescript
   export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
     return (
       <TouchableOpacity
         style={styles.card}
         onPress={() => router.push(`/restaurant/${restaurant.id}`)}
       >
         <Image
           source={{ uri: restaurant.image_url }}
           style={styles.image}
           contentFit="cover"
         />
         <View style={styles.content}>
           <Text style={styles.name}>{restaurant.name}</Text>
           <View style={styles.meta}>
             <RatingStars rating={restaurant.rating} size={16} />
             <Text style={styles.reviews}>({restaurant.review_count})</Text>
             <Text style={styles.delivery}>{restaurant.delivery_time}</Text>
           </View>
           <View style={styles.footer}>
             <Text style={styles.category}>{restaurant.category}</Text>
             <Text style={styles.fee}>
               ${restaurant.delivery_fee} delivery
             </Text>
           </View>
         </View>
       </TouchableOpacity>
     );
   }
   ```
   
   FoodItemCard.tsx:
   ```typescript
   export function FoodItemCard({ item }: { item: FoodItem }) {
     const addToCart = useCartStore(state => state.addItem);
     
     return (
       <TouchableOpacity
         style={styles.card}
         onPress={() => router.push(`/food/${item.id}`)}
       >
         <Image
           source={{ uri: item.image_url }}
           style={styles.image}
         />
         {item.original_price && (
           <View style={styles.discountBadge}>
             <Text style={styles.discountText}>
               {Math.round((1 - item.price / item.original_price) * 100)}% OFF
             </Text>
           </View>
         )}
         <View style={styles.content}>
           <Text style={styles.name} numberOfLines={1}>
             {item.name}
           </Text>
           <View style={styles.priceRow}>
             {item.original_price && (
               <Text style={styles.originalPrice}>
                 ${item.original_price}
               </Text>
             )}
             <Text style={styles.price}>${item.price}</Text>
           </View>
           <View style={styles.badges}>
             {item.is_vegetarian && <Badge>🥬 Veg</Badge>}
             {item.is_spicy && <Badge>🌶️ Spicy</Badge>}
           </View>
         </View>
         <IconButton
           icon="plus"
           size={20}
           onPress={() => addToCart(item)}
           style={styles.addButton}
         />
       </TouchableOpacity>
     );
   }
   ```

3. Data fetching:
   ```typescript
   const [featured, setFeatured] = useState<Restaurant[]>([]);
   const [popular, setPopular] = useState<FoodItem[]>([]);
   
   useEffect(() => {
     loadData();
   }, []);
   
   async function loadData() {
     // Featured restaurants
     const { data: restaurants } = await supabase
       .from('restaurants')
       .select('*')
       .eq('featured', true)
       .limit(10);
     
     setFeatured(restaurants || []);
     
     // Popular foods
     const { data: foods } = await supabase
       .from('food_items')
       .select('*, restaurant:restaurants(*)')
       .eq('popular', true)
       .limit(20);
     
     setPopular(foods || []);
   }
   ```

Test: Home loads → see categories → see restaurants → see popular foods
```

---

### STAGE 5: RESTAURANT DETAIL (Day 3-4)

**Prompt to Claude Code:**

```
Build Restaurant Detail screen for Food Delivery App.

Create app/restaurant/[id].tsx:

Layout:
```
┌────────────────────────────────────┐
│  Cover Image                        │
│  [Back] [Favorite]                  │
├────────────────────────────────────┤
│  Restaurant Name                    │
│  ⭐ 4.5 (120 reviews)               │
│  🚗 20-30 min • $2.99 delivery      │
├────────────────────────────────────┤
│  Menu Categories (Tabs)            │
│  [ Pizza ] [ Pasta ] [ Salads ]    │
├────────────────────────────────────┤
│  Food Items                         │
│  ┌──────────────────────────────┐  │
│  │ [Img] Name         $12.99    │  │
│  │       Description            │  │
│  │       ⭐ 4.2 • 🌶️ Spicy     │  │
│  │                      [+]     │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

Implementation:
```typescript
export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  useEffect(() => {
    loadRestaurant();
  }, [id]);
  
  async function loadRestaurant() {
    // Get restaurant
    const { data: rest } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    setRestaurant(rest);
    
    // Get menu items
    const { data: items } = await supabase
      .from('food_items')
      .select('*, category:menu_categories(name)')
      .eq('restaurant_id', id)
      .eq('is_available', true);
    
    setMenuItems(items || []);
    
    // Extract categories
    const cats = ['All', ...new Set(items?.map(i => i.category?.name).filter(Boolean))];
    setCategories(cats);
  }
  
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category?.name === selectedCategory);
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: restaurant?.cover_image_url }}
        style={styles.coverImage}
      />
      
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.name}>{restaurant?.name}</Text>
          <View style={styles.meta}>
            <RatingStars rating={restaurant?.rating} />
            <Text>({restaurant?.review_count} reviews)</Text>
          </View>
          <View style={styles.info}>
            <Text>🚗 {restaurant?.delivery_time}</Text>
            <Text>•</Text>
            <Text>${restaurant?.delivery_fee} delivery</Text>
          </View>
        </View>
        
        <ScrollView horizontal style={styles.categories}>
          {categories.map(cat => (
            <Chip
              key={cat}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
        
        <View style={styles.menu}>
          {filteredItems.map(item => (
            <FoodItemRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      
      <FloatingCartButton />
    </View>
  );
}
```

Test: Tap restaurant → see menu → filter by category → add to cart
```

---

### STAGE 6: CART MANAGEMENT (Day 4-5)

**Prompt to Claude Code:**

```
Implement cart system for Food Delivery App.

1. Cart Store (src/store/cartStore.ts):
   ```typescript
   import create from 'zustand';
   import { persist, createJSONStorage } from 'zustand/middleware';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   interface CartState {
     items: CartItem[];
     restaurantId: string | null;
     addItem: (foodItem: FoodItem, options?: any) => void;
     removeItem: (cartItemId: string) => void;
     updateQuantity: (cartItemId: string, quantity: number) => void;
     clearCart: () => void;
     getTotal: () => number;
     getItemCount: () => number;
   }
   
   export const useCartStore = create<CartState>()(
     persist(
       (set, get) => ({
         items: [],
         restaurantId: null,
         
         addItem: (foodItem, options) => {
           const state = get();
           
           // Check if from different restaurant
           if (state.restaurantId && state.restaurantId !== foodItem.restaurant_id) {
             // Show alert: "Clear cart from other restaurant?"
             // For now, replace
             set({
               items: [],
               restaurantId: foodItem.restaurant_id,
             });
           }
           
           // Check if item already in cart
           const existing = state.items.find(
             i => i.food_item.id === foodItem.id && 
                  JSON.stringify(i.selected_options) === JSON.stringify(options)
           );
           
           if (existing) {
             // Increment quantity
             set({
               items: state.items.map(i =>
                 i.id === existing.id
                   ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.food_item.price }
                   : i
               ),
             });
           } else {
             // Add new item
             const cartItem: CartItem = {
               id: `${Date.now()}-${Math.random()}`,
               food_item: foodItem,
               quantity: 1,
               selected_options: options,
               subtotal: foodItem.price,
             };
             
             set({
               items: [...state.items, cartItem],
               restaurantId: foodItem.restaurant_id,
             });
           }
         },
         
         removeItem: (cartItemId) => {
           set(state => ({
             items: state.items.filter(i => i.id !== cartItemId),
           }));
         },
         
         updateQuantity: (cartItemId, quantity) => {
           if (quantity <= 0) {
             get().removeItem(cartItemId);
             return;
           }
           
           set(state => ({
             items: state.items.map(i =>
               i.id === cartItemId
                 ? { ...i, quantity, subtotal: quantity * i.food_item.price }
                 : i
             ),
           }));
         },
         
         clearCart: () => {
           set({ items: [], restaurantId: null });
         },
         
         getTotal: () => {
           return get().items.reduce((sum, item) => sum + item.subtotal, 0);
         },
         
         getItemCount: () => {
           return get().items.reduce((sum, item) => sum + item.quantity, 0);
         },
       }),
       {
         name: 'cart-storage',
         storage: createJSONStorage(() => AsyncStorage),
       }
     )
   );
   ```

2. Cart Screen (app/cart.tsx):
   ```typescript
   export default function CartScreen() {
     const { items, updateQuantity, removeItem, getTotal } = useCartStore();
     const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
     
     useEffect(() => {
       if (items[0]) {
         loadRestaurant(items[0].food_item.restaurant_id);
       }
     }, [items]);
     
     if (items.length === 0) {
       return <EmptyCart />;
     }
     
     const subtotal = getTotal();
     const deliveryFee = restaurant?.delivery_fee || 0;
     const tax = subtotal * 0.1; // 10% tax
     const total = subtotal + deliveryFee + tax;
     
     return (
       <View style={styles.container}>
         <ScrollView>
           <Text style={styles.title}>Your Cart</Text>
           
           {restaurant && (
             <View style={styles.restaurantInfo}>
               <Text style={styles.restaurantName}>{restaurant.name}</Text>
               <Text style={styles.deliveryTime}>{restaurant.delivery_time}</Text>
             </View>
           )}
           
           {items.map(item => (
             <CartItemComponent
               key={item.id}
               item={item}
               onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
               onRemove={() => removeItem(item.id)}
             />
           ))}
           
           <View style={styles.summary}>
             <SummaryRow label="Subtotal" value={subtotal} />
             <SummaryRow label="Delivery Fee" value={deliveryFee} />
             <SummaryRow label="Tax" value={tax} />
             <Divider />
             <SummaryRow label="Total" value={total} large />
           </View>
         </ScrollView>
         
         <Button
           mode="contained"
           onPress={() => router.push('/checkout')}
           style={styles.checkoutButton}
         >
           Proceed to Checkout - ${total.toFixed(2)}
         </Button>
       </View>
     );
   }
   ```

3. Floating Cart Button:
   ```typescript
   export function FloatingCartButton() {
     const itemCount = useCartStore(state => state.getItemCount());
     
     if (itemCount === 0) return null;
     
     return (
       <TouchableOpacity
         style={styles.floatingButton}
         onPress={() => router.push('/cart')}
       >
         <View style={styles.badge}>
           <Text style={styles.badgeText}>{itemCount}</Text>
         </View>
         <Icon name="cart" size={24} color="white" />
         <Text style={styles.buttonText}>View Cart</Text>
       </TouchableOpacity>
     );
   }
   ```

Test: Add items → view cart → update quantities → remove items → see total
```

---

### STAGE 7: CHECKOUT & ORDERS (Day 5-6)

**Prompt to Claude Code:**

```
Implement checkout and order placement for Food Delivery App.

1. Checkout Screen (app/checkout.tsx):
   ```typescript
   export default function CheckoutScreen() {
     const { items, getTotal, clearCart } = useCartStore();
     const user = useUserStore(state => state.profile);
     const [addresses, setAddresses] = useState([]);
     const [selectedAddress, setSelectedAddress] = useState(null);
     const [paymentMethod, setPaymentMethod] = useState('cash');
     const [instructions, setInstructions] = useState('');
     const [placing, setPlacing] = useState(false);
     
     useEffect(() => {
       loadAddresses();
     }, []);
     
     async function loadAddresses() {
       const { data } = await supabase
         .from('user_addresses')
         .select('*')
         .eq('user_id', user.id)
         .order('is_default', { ascending: false });
       
       setAddresses(data || []);
       if (data?.length) {
         setSelectedAddress(data[0]);
       }
     }
     
     async function placeOrder() {
       if (!selectedAddress) {
         Alert.alert('Error', 'Please select delivery address');
         return;
       }
       
       setPlacing(true);
       
       try {
         const subtotal = getTotal();
         const deliveryFee = items[0].food_item.restaurant?.delivery_fee || 0;
         const tax = subtotal * 0.1;
         const total = subtotal + deliveryFee + tax;
         
         // Create order
         const { data: order, error } = await supabase
           .from('orders')
           .insert({
             user_id: user.id,
             restaurant_id: items[0].food_item.restaurant_id,
             status: 'pending',
             subtotal,
             delivery_fee: deliveryFee,
             tax,
             total,
             delivery_address: selectedAddress,
             payment_method: paymentMethod,
             special_instructions: instructions,
             estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
           })
           .select()
           .single();
         
         if (error) throw error;
         
         // Create order items
         const orderItems = items.map(item => ({
           order_id: order.id,
           food_item_id: item.food_item.id,
           food_item_name: item.food_item.name,
           quantity: item.quantity,
           unit_price: item.food_item.price,
           selected_options: item.selected_options,
           special_request: item.special_request,
           subtotal: item.subtotal,
         }));
         
         await supabase.from('order_items').insert(orderItems);
         
         // Clear cart
         clearCart();
         
         // Navigate to order tracking
         router.replace(`/order-tracking/${order.id}`);
       } catch (error) {
         Alert.alert('Error', 'Failed to place order');
       } finally {
         setPlacing(false);
       }
     }
     
     return (
       <ScrollView style={styles.container}>
         <Text style={styles.title}>Checkout</Text>
         
         <Section title="Delivery Address">
           {addresses.map(addr => (
             <AddressCard
               key={addr.id}
               address={addr}
               selected={selectedAddress?.id === addr.id}
               onSelect={() => setSelectedAddress(addr)}
             />
           ))}
           <Button onPress={() => router.push('/add-address')}>
             Add New Address
           </Button>
         </Section>
         
         <Section title="Payment Method">
           <RadioButton.Group
             value={paymentMethod}
             onValueChange={setPaymentMethod}
           >
             <RadioButton.Item label="Cash on Delivery" value="cash" />
             <RadioButton.Item label="Credit Card" value="card" disabled />
             <RadioButton.Item label="Wallet" value="wallet" disabled />
           </RadioButton.Group>
         </Section>
         
         <Section title="Special Instructions">
           <TextInput
             multiline
             numberOfLines={3}
             value={instructions}
             onChangeText={setInstructions}
             placeholder="Add delivery instructions..."
           />
         </Section>
         
         <OrderSummary items={items} />
         
         <Button
           mode="contained"
           onPress={placeOrder}
           loading={placing}
           style={styles.placeOrderButton}
         >
           Place Order
         </Button>
       </ScrollView>
     );
   }
   ```

2. Order Tracking (app/order-tracking/[id].tsx):
   ```typescript
   export default function OrderTrackingScreen() {
     const { id } = useLocalSearchParams();
     const [order, setOrder] = useState<Order | null>(null);
     
     useEffect(() => {
       loadOrder();
       
       // Subscribe to real-time updates
       const subscription = supabase
         .channel('order-updates')
         .on('postgres_changes', {
           event: 'UPDATE',
           schema: 'public',
           table: 'orders',
           filter: `id=eq.${id}`,
         }, (payload) => {
           setOrder(payload.new as Order);
         })
         .subscribe();
       
       return () => {
         subscription.unsubscribe();
       };
     }, [id]);
     
     async function loadOrder() {
       const { data } = await supabase
         .from('orders')
         .select('*, restaurant:restaurants(*), items:order_items(*)')
         .eq('id', id)
         .single();
       
       setOrder(data);
     }
     
     const steps = [
       { status: 'pending', label: 'Order Placed', icon: 'check-circle' },
       { status: 'confirmed', label: 'Confirmed', icon: 'check-circle' },
       { status: 'preparing', label: 'Preparing', icon: 'chef-hat' },
       { status: 'ready', label: 'Ready', icon: 'package' },
       { status: 'on_the_way', label: 'On the Way', icon: 'truck' },
       { status: 'delivered', label: 'Delivered', icon: 'home' },
     ];
     
     return (
       <View style={styles.container}>
         <Text style={styles.title}>Order Tracking</Text>
         
         <Card>
           <Card.Content>
             <Text style={styles.orderId}>Order #{order?.id.slice(0, 8)}</Text>
             <Text style={styles.restaurant}>{order?.restaurant?.name}</Text>
             <Text style={styles.eta}>
               Estimated delivery: {formatTime(order?.estimated_delivery_time)}
             </Text>
           </Card.Content>
         </Card>
         
         <View style={styles.timeline}>
           {steps.map((step, index) => (
             <TimelineStep
               key={step.status}
               {...step}
               active={getStepIndex(order?.status) >= index}
               completed={getStepIndex(order?.status) > index}
             />
           ))}
         </View>
         
         <Card style={styles.itemsCard}>
           <Card.Title title="Order Items" />
           <Card.Content>
             {order?.items?.map(item => (
               <OrderItemRow key={item.id} item={item} />
             ))}
           </Card.Content>
         </Card>
         
         {order?.status !== 'delivered' && (
           <Button
             mode="outlined"
             onPress={() => {/* Call restaurant */}}
             style={styles.contactButton}
           >
             Contact Restaurant
           </Button>
         )}
       </View>
     );
   }
   ```

Test: Checkout → place order → see tracking → status updates
```

---

### STAGE 8: FAVORITES & SEARCH (Day 6-7)

**Prompt to Claude Code:**

```
Implement Favorites and Search features for Food Delivery App.

1. Favorites Screen (app/(tabs)/favorites.tsx):
   ```typescript
   export default function FavoritesScreen() {
     const [favorites, setFavorites] = useState([]);
     const user = useUserStore(state => state.profile);
     
     useEffect(() => {
       loadFavorites();
     }, []);
     
     async function loadFavorites() {
       const { data } = await supabase
         .from('favorites')
         .select('*, restaurant:restaurants(*), food_item:food_items(*)')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false });
       
       setFavorites(data || []);
     }
     
     async function removeFavorite(id: string) {
       await supabase.from('favorites').delete().eq('id', id);
       loadFavorites();
     }
     
     const restaurantFavs = favorites.filter(f => f.restaurant);
     const foodFavs = favorites.filter(f => f.food_item);
     
     return (
       <ScrollView style={styles.container}>
         <Text style={styles.title}>Your Favorites</Text>
         
         <Section title="Restaurants">
           {restaurantFavs.map(fav => (
             <RestaurantCard
               key={fav.id}
               restaurant={fav.restaurant}
               onRemoveFavorite={() => removeFavorite(fav.id)}
             />
           ))}
         </Section>
         
         <Section title="Food Items">
           {foodFavs.map(fav => (
             <FoodItemCard
               key={fav.id}
               item={fav.food_item}
               onRemoveFavorite={() => removeFavorite(fav.id)}
             />
           ))}
         </Section>
       </ScrollView>
     );
   }
   ```

2. Search Screen (app/(tabs)/search.tsx):
   ```typescript
   export default function SearchScreen() {
     const [query, setQuery] = useState('');
     const [results, setResults] = useState({ restaurants: [], foods: [] });
     const [loading, setLoading] = useState(false);
     
     const debouncedSearch = useDebounce(query, 500);
     
     useEffect(() => {
       if (debouncedSearch) {
         search(debouncedSearch);
       } else {
         setResults({ restaurants: [], foods: [] });
       }
     }, [debouncedSearch]);
     
     async function search(q: string) {
       setLoading(true);
       
       const [restaurants, foods] = await Promise.all([
         supabase
           .from('restaurants')
           .select('*')
           .ilike('name', `%${q}%`)
           .limit(10),
         
         supabase
           .from('food_items')
           .select('*, restaurant:restaurants(*)')
           .ilike('name', `%${q}%`)
           .limit(20),
       ]);
       
       setResults({
         restaurants: restaurants.data || [],
         foods: foods.data || [],
       });
       
       setLoading(false);
     }
     
     return (
       <View style={styles.container}>
         <SearchBar
           value={query}
           onChangeText={setQuery}
           placeholder="Search restaurants or dishes..."
         />
         
         {loading && <ActivityIndicator />}
         
         <ScrollView>
           {results.restaurants.length > 0 && (
             <Section title="Restaurants">
               {results.restaurants.map(r => (
                 <RestaurantCard key={r.id} restaurant={r} />
               ))}
             </Section>
           )}
           
           {results.foods.length > 0 && (
             <Section title="Food Items">
               {results.foods.map(f => (
                 <FoodItemCard key={f.id} item={f} />
               ))}
             </Section>
           )}
           
           {!loading && query && results.restaurants.length === 0 && results.foods.length === 0 && (
             <EmptyState message="No results found" />
           )}
         </ScrollView>
       </View>
     );
   }
   ```

Test: Add favorites → view favorites screen → search → see results
```

---

### STAGE 9: PROFILE & SETTINGS (Day 7)

**Prompt to Claude Code:**

```
Build Profile screen for Food Delivery App.

Create app/(tabs)/profile.tsx:

```typescript
export default function ProfileScreen() {
  const { user, profile, signOut } = useUserStore();
  const [editing, setEditing] = useState(false);
  
  const menuItems = [
    { icon: 'account', label: 'Edit Profile', onPress: () => setEditing(true) },
    { icon: 'map-marker', label: 'Manage Addresses', route: '/addresses' },
    { icon: 'credit-card', label: 'Payment Methods', route: '/payment-methods' },
    { icon: 'receipt', label: 'Order History', route: '/orders' },
    { icon: 'help-circle', label: 'Help & Support', route: '/support' },
    { icon: 'information', label: 'About', route: '/about' },
    { icon: 'logout', label: 'Sign Out', onPress: handleSignOut },
  ];
  
  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: () => signOut(), style: 'destructive' },
      ]
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/80' }}
        />
        <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <List.Item
            key={index}
            title={item.label}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              if (item.onPress) item.onPress();
              else if (item.route) router.push(item.route);
            }}
          />
        ))}
      </View>
      
      <EditProfileModal
        visible={editing}
        onDismiss={() => setEditing(false)}
        profile={profile}
      />
    </ScrollView>
  );
}
```

Test: View profile → edit info → manage addresses → sign out
```

---

### STAGE 10: POLISH & LAUNCH (Day 7-8)

**Prompt to Claude Code:**

```
Final polish and launch preparation for Food Delivery App.

1. Add skeleton loaders for data fetching
2. Implement pull-to-refresh on lists
3. Add empty states (no restaurants, no favorites, etc.)
4. Error handling with retry buttons
5. Image caching with expo-image
6. Dark mode support (optional)
7. Splash screen and app icon
8. Push notifications setup (order status updates)

9. Performance optimization:
   - Lazy load images
   - Virtualized lists (FlatList)
   - Memoize components
   - Optimize re-renders

10. Launch checklist:
    - [ ] All screens working
    - [ ] No console errors
    - [ ] Tested on real devices
    - [ ] Images optimized
    - [ ] Database seeded with sample data
    - [ ] RLS policies tested
    - [ ] Privacy policy page
    - [ ] Terms & conditions

Build and test:
```bash
# iOS
eas build --platform ios --profile preview

# Android
eas build --platform android --profile preview
```
```

---

## 🎨 DESIGN SYSTEM (Based on Screenshots)

### Colors

```typescript
export const colors = {
  primary: '#FF6B6B',        // Red/Orange (food app standard)
  secondary: '#4ECDC4',      // Teal
  accent: '#FFD93D',         // Yellow
  background: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  border: '#ECF0F1',
};
```

### Typography

```typescript
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};
```

---

## 📊 SUCCESS METRICS

### Week 1 (Soft Launch)
- 50-100 downloads
- 20+ orders placed
- No critical bugs
- Collect feedback

### Month 1
- 500-1000 users
- 200+ orders
- 4+ star rating
- 50%+ retention (7-day)

### Month 3
- 5000+ users
- 2000+ orders/month
- Partner with 20+ restaurants
- Positive reviews

---

## 💡 FINAL WISDOM

### For Success

1. **Food imagery is critical** - high-quality photos sell
2. **Speed matters** - hungry users are impatient
3. **Cart persistence** - don't lose their order
4. **Clear pricing** - no hidden fees
5. **Order tracking** - reduce anxiety

### For Quality

1. **Offline capability** - cache menu data
2. **Image optimization** - compress, lazy load
3. **Smooth animations** - native feel
4. **Error handling** - graceful failures
5. **Search performance** - debounce, cache

### For Growth

1. **Referral system** - invite friends discount
2. **Loyalty program** - points for orders
3. **Push notifications** - order updates, deals
4. **Social sharing** - share favorite dishes
5. **Restaurant partnerships** - exclusive deals

---

## 🎉 YOU'RE READY

This is project #8 in your portfolio!

**What makes this project special:**
- **Full e-commerce flow** (browse → cart → checkout → order)
- **Real-time updates** (order tracking)
- **Image-heavy** (food photography)
- **Location-based** (delivery addresses, maps)
- **Complex state** (cart, favorites, orders)

**Next Steps:**
1. Start with STAGE 1 (Setup)
2. Work through each stage
3. Seed database with delicious food data
4. Test with real orders
5. Launch in 3-4 weeks

Good luck building your Food Delivery App! 🍕🚀

---

**Document Version:** 1.0  
**Based on:** UI Screenshots Analysis  
**Last Updated:** February 2026  
**Estimated Build Time:** 3-4 weeks with Claude Code  
**Platform:** iOS + Android Mobile App  
**Type:** Food Delivery / E-commerce
