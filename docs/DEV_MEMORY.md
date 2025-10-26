# 🧠 Development Memory - Technical Context

This document contains detailed technical context, architecture decisions, and problems solved during development. Useful for picking up the project after some time.

---

## 🎯 Project Goal

Stock management application for **home dialysis** designed specifically for **elderly people**. The user is a home dialysis patient who needs to control the inventory of ~23 different materials.

### Key User Requirements

1. Simple and large interface (elderly people)
2. Quickly see which materials are low in stock
3. Easily update stocks
4. Automatically generate orders
5. Download Excel with supplier format (with "Presentation" column)

---

## 🏗️ Architecture Decisions

### Why TanStack Router?

- **File-based routing**: More intuitive than manual configuration
- **Type-safe**: Route errors at compile time
- **beforeLoad guards**: Simple and declarative authentication
- **Loader functions**: Pre-load data before rendering

**Alternative considered**: React Router v6
**Rejected because**: Not type-safe, requires more boilerplate

### Why TanStack Query?

- **Automatic cache**: Reduces calls to Supabase
- **Background refetching**: Data always fresh
- **Optimistic updates**: Smoother UX
- **Selective invalidation**: Fine control of re-fetches

**Alternative considered**: SWR, useState + useEffect
**Rejected because**: Fewer features, more manual code

### Why Shadcn/ui?

- **Copy-paste**: Not a dependency, code is copied
- **Customizable**: Full control over components
- **Accessible**: Complete ARIA out-of-the-box
- **Tailwind**: Perfect integration

**Alternative considered**: Material-UI, Chakra UI
**Rejected because**: Too heavy, less control

### Why Supabase?

- **Auth included**: Google OAuth without custom backend
- **RLS**: Security at database level
- **PostgreSQL**: Robust and well-known database
- **Real-time** (not used yet, but available)
- **Generous free tier**: Perfect for personal project

**Alternative considered**: Firebase, PocketBase
**Rejected because**: Firebase expensive for PostgreSQL, PocketBase requires self-hosting

---

## 🔑 Key Domain Concepts

### Available Sessions Calculation

```typescript
availableSessions = floor(currentStock / usagePerSession)
```

**Examples**:
- Stock: 20 bags, Usage: 1 bag/session → 20 sessions
- Stock: 15 units, Usage: 2 units/session → 7 sessions
- Stock: 3 bottles, Usage: 0.1 bottles/session → 30 sessions

### Order Threshold

```typescript
needsOrder = availableSessions < minSessions
```

- `minSessions` = 7 (default) - Minimum reserve stock
- `maxSessions` = 20 (default) - Recommended maximum stock

### Quantity to Order

```typescript
unitsToOrder = orderQuantity - currentStock
```

**Logic**:
- `orderQuantity` is the "target" quantity when ordering
- If current stock is 5 and orderQuantity is 14 → Order 9 units
- This brings stock from 5 to 14

---

## 🗄️ Database Schema - Decisions

### UUID vs. Numeric ID

- **Chosen**: UUID
- **Reason**: Better for distributed systems, not predictable, more secure

### `uuid_generate_v7()` vs. `uuid_generate_v4()`

- **materials table**: `uuid_generate_v7()`
- **Reason**: v7 is time-ordered, better for indexes and sorting
- **Other tables**: `uuid_generate_v4()` (standard)

### Soft Delete vs. Hard Delete

- **Chosen**: Hard delete with `ON DELETE CASCADE`
- **Reason**: We don't need complete audit trail, simplifies queries
- **Note**: inventory_logs maintains change history

### DECIMAL vs. FLOAT for Stock

- **Chosen**: DECIMAL
- **Reason**: Exact precision, no rounding errors
- **Important**: Supports fractional quantities (e.g., 0.1 bottles/session)

### `uv` Field (Presentation)

- **Added**: After initial implementation
- **Reason**: User needed to show supplier presentation (C/2, C/24, etc.)
- **Impact**: Updated in materials, order_items, and entire UI

---

## 🔐 Authentication - Problem Solved

### ❌ Original Problem

```typescript
// In AuthContext
signInWithGoogle({
  redirectTo: `${window.location.origin}/dashboard`
})
```

**Error**: After login, it didn't redirect to dashboard. User stayed on login page or saw blank screen.

### ✅ Solution

```typescript
// 1. Redirect to intermediate callback
signInWithGoogle({
  redirectTo: `${window.location.origin}/auth-callback`
})

// 2. In /auth-callback, wait for session
useEffect(() => {
  if (!isLoading) {
    if (session) navigate({ to: '/dashboard' })
    else navigate({ to: '/login' })
  }
}, [session, isLoading])
```

**Reason**: OAuth needs time to establish the session. The intermediate callback waits for Supabase to confirm authentication before redirecting.

---

## 📊 Patterns and Conventions

### File Naming

```
components/
  MyComponent/
    MyComponent.tsx        # Component
    MyComponent.module.css # Styles (optional)
    index.ts               # Re-export
```

### Custom Hooks

```typescript
// Naming: use[Entity][Action]
useMaterials()           // GET all
useMaterial(id)          // GET one
useUpdateMaterialStock() // UPDATE
useCreateOrder()         // CREATE
```

### Change Types in inventory_logs

```typescript
type ChangeType =
  | 'manual'  // Individual edit from ItemEditor
  | 'review'  // Batch update from Review Mode
  | 'order'   // Order reception (future)
  | 'usage'   // Usage logging (future)
```

### Order States

```typescript
type OrderStatus =
  | 'draft'     // Created but not submitted
  | 'pending'   // Sent to supplier
  | 'completed' // Received
```

---

## 🎨 UI Components - Decisions

### +1/-1 Buttons in ItemEditor

```tsx
<Button className="h-16 w-16 text-2xl">+1</Button>
```

- **Size**: 16x16 (64px) - Very large for touch
- **Text**: 2xl (24px) - Readable without glasses
- **Reason**: Elderly users with possible vision or dexterity issues

### Status Colors

```typescript
availableSessions >= minSessions
  ? 'green-500'  // ✓ Sufficient stock
  : 'red-500'    // ! Low stock
```

- **Green/Red**: Maximum contrast, universally understood
- **Avoided**: Yellow (ambiguous), blue (not urgent enough)

### Progress Bar in Review

```typescript
progress = ((currentIndex + 1) / totalMaterials) * 100
```

- **Visual**: Clearly shows how much is left
- **UX**: Reduces anxiety in long process (23 materials)

---

## 📦 Excel Export - Implementation

### Library: xlsx

```typescript
import * as XLSX from 'xlsx'
```

### Excel Format

```typescript
[
  ['DIALYSIS MATERIAL ORDER'],                    // Header
  [],
  ['Order Number:', 'ORD-1729...'],
  ['Date:', '10/26/2025'],
  ['Requested by:', 'User'],
  [],
  ['Code', 'Presentation', 'Description', ...],   // Columns
  ['483197', 'C/2', 'Solution...', 10, 'bags'],
  // ... more items
  [],
  ['TOTAL ITEMS:', 5]
]
```

### Column Widths

```typescript
worksheet['!cols'] = [
  { wch: 12 }, // Code - 12 characters
  { wch: 12 }, // Presentation - 12 characters
  { wch: 40 }, // Description - 40 characters
  { wch: 12 }, // Quantity
  { wch: 10 }, // Unit
  { wch: 25 }, // Notes
]
```

---

## 🔧 Configuration and Tooling

### Import Aliases

```typescript
// tsconfig.json + vite.config.ts
'#/*': ['./src/*']
'#shared/*': ['./src/shared/*']
'#features/*': ['./src/features/*']
```

**Usage**:

```typescript
import { Material } from '#/shared/types'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
```

### Biome vs. ESLint + Prettier

- **Chosen**: Biome
- **Reason**: Faster (Rust), less configuration, all-in-one
- **Configuration**: `.biomejs.json` with specific rules

### Tailwind CSS v4 vs. v3

- **Chosen**: v4 (alpha)
- **Reason**: PostCSS-based, faster, better DX
- **Setup**: `@tailwindcss/postcss` instead of `tailwindcss`

---

## 🧪 Testing - Strategy

### Unit Tests

- Custom hooks (useMaterials, useReviewSession)
- Utilities (calculations, formatters)

### Integration Tests

- Components with React Testing Library
- User interactions (clicks, inputs)

### Mocking

- **MSW** for Supabase API mocking
- **Auth Context Mock** for protected component tests

### Not Implemented (but recommended)

- E2E tests with Playwright
- Visual regression with Percy/Chromatic

---

## 📁 Folder Structure - Rationale

```
src/
├── features/              # 🎯 Self-contained features
│   └── inventory/
│       ├── components/    # Feature-specific UI
│       ├── hooks/         # Data fetching logic
│       └── utils/         # Feature utilities
│
├── shared/                # 🔧 Shared code
│   ├── api/              # Supabase client + generated types
│   ├── components/       # Generic UI (Shadcn)
│   ├── contexts/         # Global state (Auth)
│   ├── lib/              # General utilities
│   └── types/            # Domain types
│
└── routes/               # 🛣️ File-based routes
    └── _authenticated/   # Layout with guard
```

**Rule**: If a file is used by 2+ features → goes to `shared/`

---

## 🐛 Bugs Solved

### 1. Login Redirect Loop

- **Error**: Infinite redirect between /login and /dashboard
- **Cause**: Guard evaluated session before it was established
- **Fix**: Intermediate callback that waits for `isLoading === false`

### 2. Hot Reload Issues with Context

- **Error**: "useAuth export is incompatible"
- **Cause**: Fast Refresh cannot preserve hooks
- **Fix**: Normal, only appears in dev, doesn't affect functionality

### 3. Tailwind Not Applying Styles

- **Error**: CSS classes weren't applied
- **Cause**: Bad PostCSS configuration with Tailwind v4
- **Fix**: Use correct `@tailwindcss/postcss`

### 4. TypeScript Errors with Database Types

- **Error**: Types don't match between DB and application
- **Cause**: Schema update without regenerating types
- **Fix**: Always update `database.types.ts` after SQL changes

---

## 💡 Lessons Learned

### 1. Simplicity > Features

- User only needs 4 screens: Inventory, Editor, Review, Orders
- Resist temptation to add complex dashboards

### 2. Elderly-first Design

- Large buttons (64px) > minimalist aesthetics
- Strong colors > subtle design
- Guided flow > total freedom

### 3. Type Safety Pays Off

- Detect type errors before runtime
- Safe refactors with TypeScript
- Autocomplete greatly improves DX

### 4. SQL First, ORM Later

- Writing direct SQL gives better control
- Supabase client is sufficient (don't need Prisma)
- RLS greatly simplifies security

---

## 🔮 If Starting Again...

### Would Keep

- ✅ TanStack Router + Query
- ✅ Supabase
- ✅ Feature-first architecture
- ✅ Strict TypeScript
- ✅ Shadcn/ui

### Would Change

- ⚠️ Add Playwright from the start
- ⚠️ Storybook setup for isolated components
- ⚠️ Analytics from day 1 (PostHog)
- ⚠️ Error monitoring (Sentry) configured early

### Would Not Add

- ❌ Redux/Zustand (TanStack Query + Context is enough)
- ❌ Server components (not needed for this case)
- ❌ GraphQL (PostgreSQL + RLS is simpler)

---

## 🎓 Useful Resources

### Documentation

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)

### Common Supabase Issues

- [Auth callback best practices](https://supabase.com/docs/guides/auth/redirect-urls)
- [RLS debugging](https://supabase.com/docs/guides/auth/row-level-security)

### TypeScript

- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

## 📝 Useful Project Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Build for production
npm run preview             # Preview build

# Testing
npm run test                # Run tests
npm run test:ui             # Tests with Vitest UI
npm run test:coverage       # Coverage report

# Linting and Formatting
npm run lint                # Lint with Biome
npm run format              # Format with Biome
npm run typecheck           # TypeScript check only

# Supabase (if you install CLI)
supabase start              # Start local Supabase
supabase db reset           # Reset local DB
supabase gen types typescript # Regenerate types
```

---

## 🔐 Security - Checklist

- ✅ Environment variables for secrets
- ✅ RLS enabled on all tables
- ✅ Auth via OAuth (no passwords)
- ✅ HTTPS in production
- ✅ No API keys in client code
- ✅ Input validation in forms
- ⚠️ TODO: Rate limiting on API
- ⚠️ TODO: CORS configuration review

---

## 📊 Performance - Optimizations

### Implemented

- ✅ TanStack Query cache (5 minutes)
- ✅ Lazy loading of heavy components
- ✅ DB indexes for frequent queries
- ✅ Vite automatic code splitting

### Not Needed (Yet)

- ❌ Virtual scrolling (only 23 items)
- ❌ Web Workers (no heavy operations)
- ❌ Service Worker (no offline mode)

---

This document should give you all the necessary context to pick up the project in the future. Good luck! 🚀
