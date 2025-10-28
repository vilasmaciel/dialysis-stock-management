# Development Guidelines

## General rules

- All code, docs and texts must be in english
- Commits must follow conventional commits convention

## Design Principles

### Responsive Design Strategy

All UI designs and features must follow these principles:

1. **Desktop and Mobile Support**: The application must work seamlessly on both desktop and mobile devices
   - Desktop: ≥640px (sm breakpoint and above)
   - Mobile: <640px
   - Tablet considerations when relevant

2. **Mobile-First Approach**: Always design and implement from mobile perspective first
   - Start with mobile layout and constraints
   - Enhance progressively for larger screens
   - Ensure touch targets are appropriate (minimum 44x44px)
   - Optimize for vertical scrolling and limited horizontal space
   - Example pattern:
     ```tsx
     // Mobile: compact summary
     <div className="sm:hidden">Compact view</div>

     // Desktop: rich detailed view
     <Card className="hidden sm:block">Detailed view</Card>
     ```

3. **Industry-Standard Patterns**: Leverage proven UX patterns from leading applications
   - Research patterns used by: Gmail, Shopify, Asana, Linear, Notion, Slack, etc.
   - Use familiar interaction models (tap-to-select, swipe gestures, steppers, etc.)
   - Follow platform conventions (iOS/Android guidelines for mobile web)
   - Prioritize patterns users already know and expect
   - Document pattern sources in implementation (e.g., "Pattern based on: Gmail selection model")

4. **Application-Wide Consistency**: Maintain uniform patterns across all features
   - Reuse components and interaction patterns
   - Consistent spacing, colors, typography (via Tailwind/SHADCN)
   - Same navigation patterns throughout (PageHeader, BottomNavigation)
   - Unified feedback mechanisms (loading states, errors, success messages)
   - Consistent terminology and copy
   - Example: If selection uses background color + check icon in one place, use it everywhere

### Design Decision Process

When implementing new features or redesigning existing ones:

1. **Analyze mobile constraints first** - What's the minimum viable layout?
2. **Research industry patterns** - How do successful apps solve this?
3. **Consider consistency** - Does this match existing patterns in the app?
4. **Plan responsive behavior** - How does it adapt from mobile to desktop?
5. **Validate with user flow** - Is the interaction intuitive and familiar?

### Examples of Good Patterns in This Project

- **Selection**: Background color + check icon (mobile visible, desktop clear)
- **Navigation**: Bottom nav on mobile, header always present on desktop
- **Summary cards**: Hide on mobile, show compact text; full cards on desktop
- **Action buttons**: Stacked on mobile (100% width), inline on desktop
- **Forms/Inputs**: Full-width on mobile, constrained width on desktop

## Current Stack

- **Build Tool:** Vite
- **Router:** TanStack Router (file-based routing)
- **Data Fetching:** TanStack Query (React Query)
- **UI Library:** React 19
- **Component Library:** SHADCN/UI (for rapid development)
- **Styling:** Tailwind CSS + CSS Modules (only for custom domain components)
- **Testing:** Vitest + React Testing Library + MSW
- **Linting/Formatting:** Biome (automatic)

## Core Architecture Principles

1. **Feature-First Organization**: Views are self-contained with their own components, hooks, domain logic, and contexts
2. **SHADCN-First UI**: Use SHADCN components for all common UI elements; create custom domain components only when needed
3. **Component Encapsulation**: Domain components in their own directory; CSS Modules only for complex custom styling
4. **Custom Hooks for Logic**: Extract complex logic and API calls to custom hooks
5. **Domain Classes for Complex Logic**: Use TypeScript classes for business logic, interfaces for simple data shapes
6. **Import Aliases**: Use `#` aliases for cross-feature imports, relative imports within features

**Example of feature-first structure:**

```typescript
// inventory/components/MaterialCard/MaterialCard.tsx - Domain component
import { Card, CardHeader, CardContent } from '#/shared/components/ui/card'; // SHADCN
import { Button } from '#/shared/components/ui/button'; // SHADCN
import { useMaterials } from '../hooks/useMaterials'; // Same feature
import type { Material } from '../types'; // Same feature

// routes/_authenticated/inventory.tsx - Route component
import { useNavigate } from '@tanstack/react-router';
import { useMaterials } from '#features/inventory/hooks/useMaterials'; // Cross-feature
import { MaterialCard } from '#features/inventory/components/MaterialCard/MaterialCard'; // Cross-feature
```

## 3. Component Development Rules

### Essential Rules

1. **Use SHADCN First**: Leverage SHADCN components for common UI elements (buttons, cards, dialogs, inputs, etc.)
2. **Directory Structure**: Domain-specific components in their own directory with `.module.css` only when custom styling is needed
3. **TypeScript Props**: Always define props with TypeScript types/interfaces
4. **Logic Extraction**: Extract complex logic to custom hooks
5. **Subcomponents**: Place component-specific children in `components/` subdirectory
6. **Functional Components**: Use functional components with hooks, never class components
7. **Tailwind-First Styling**: Use Tailwind utility classes for styling; CSS Modules only for complex custom components

### Component Strategy

**SHADCN Components (Preferred):**

- Use for: buttons, cards, dialogs, inputs, forms, modals, dropdowns, etc.
- Install new components with: `npx shadcn-ui@latest add [component-name]`
- Customize via Tailwind classes or extend SHADCN component props

**Custom Components (When Needed):**

- Create when: domain-specific logic, complex business rules, or unique layouts required
- Use CSS Modules for: complex styling that's hard to express with Tailwind
- Example: `MaterialCard`, `OrderItemCard`, `ReviewSummary` (domain components)

### Component Complexity Guidelines

- **Simple components**: Use SHADCN directly or compose SHADCN components
- **Complex components**: Orchestrate SHADCN + custom components with multiple hooks
- **Container components**: Handle data fetching and state management
- **Presentation components**: Focus on rendering, prefer SHADCN primitives

**❌ Critical Don'ts:**

- Never create custom UI components (buttons, inputs, etc.) when SHADCN provides them
- Never put business logic directly in component render functions
- Never use class components - always use functional components with hooks
- Never create components without TypeScript props definitions
- Never skip installing available SHADCN components to reinvent the wheel

## 4. SHADCN/UI Usage Guide

### Installation & Setup

SHADCN is already configured via `components.json`. To add new components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
# ... etc
```

### Import Pattern

```typescript
// ✅ Correct: Import from shared UI components
import { Button } from '#/shared/components/ui/button'
import { Card, CardHeader, CardContent } from '#/shared/components/ui/card'

// ❌ Wrong: Don't create custom button components
import { CustomButton } from './components/CustomButton'
```

### Composition Pattern

Build domain components by composing SHADCN primitives:

```typescript
// MaterialCard.tsx - Domain component using SHADCN primitives
import { Card, CardHeader, CardContent } from '#/shared/components/ui/card'
import { Button } from '#/shared/components/ui/button'
import type { Material } from '../types'

interface MaterialCardProps {
  material: Material
  onEdit: (id: string) => void
}

export function MaterialCard({ material, onEdit }: MaterialCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{material.name}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Stock: {material.stock}</p>
        <Button onClick={() => onEdit(material.id)} variant="outline">
          Edit
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Styling Strategy

1. **Tailwind First**: Use utility classes for most styling
2. **SHADCN Variants**: Leverage built-in variants (e.g., `variant="outline"`)
3. **Custom Classes**: Use `className` prop to extend SHADCN components
4. **CSS Modules**: Only for complex domain-specific styles that need scoping

### Available SHADCN Components

Common components to use:

- **Layout**: `Card`, `Separator`, `Tabs`, `Sheet`
- **Forms**: `Input`, `Button`, `Select`, `Checkbox`, `Radio`, `Switch`, `Label`
- **Feedback**: `Alert`, `Toast`, `Dialog`, `Popover`, `Tooltip`
- **Data**: `Table`, `Badge`, `Avatar`

[Full list](https://ui.shadcn.com/docs/components)

## 7. Testing Standards

### Test Structure

Tests reside in `tests/` directory mirroring the `src/` structure:

```bash
tests/
├── components/           # Tests for shared components
│   └── Header/          
├── views/               # Tests for views and features
│   ├── CreateReport/   
│   └── ReportList/     
└── shared/             # Tests for shared code
    └── hooks/          
```

### Testing Tools & Patterns

**Tools:**

- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **@testing-library/jest-dom**: Additional matchers

**Basic Test Pattern:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text and handles click', async () => {
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Key Testing Practices

1. **Accessible Queries**: Prioritize `getByRole`, `getByLabelText` over `getByTestId`
2. **User Interactions**: Use `@testing-library/user-event` for realistic interactions
3. **API Mocking**: Use MSW to mock API calls, never make real network requests
4. **Focus on Behavior**: Test what users see and do, not implementation details

### What to Test

- **Domain Components**: Business logic, data transformation, conditional rendering
- **SHADCN Components**: Don't test SHADCN internals, only test your usage and integration
- **Hooks**: Return values, state updates, side effects
- **Views**: Integration of components and hooks, data display
- **Domain Logic**: Business rules, calculations, transformations

**Testing with SHADCN:**

```typescript
// ✅ Good: Test your domain logic, not SHADCN internals
it('displays material name and stock count', () => {
  const material = { id: '1', name: 'Dialyzer', stock: 10 };
  render(<MaterialCard material={material} onEdit={jest.fn()} />);
  
  expect(screen.getByText('Dialyzer')).toBeInTheDocument();
  expect(screen.getByText('Stock: 10')).toBeInTheDocument();
});

// ❌ Bad: Testing SHADCN Card component behavior
it('card has correct background color', () => {
  // Don't test SHADCN implementation details
});
```

**❌ Critical Don'ts:**

- Never test SHADCN component internals (styling, variants, etc.)
- Never test implementation details like internal state variables
- Never make real API calls in tests - always mock with MSW
- Never use `querySelector` on the container - use accessible queries
- Never skip testing user interactions and error states

## Development Workflow

### TDD Cycle (Red-Green-Refactor)

Follow Test-Driven Development for domain components and hooks:

1. **🔴 Red**: Write a failing test that describes the desired behavior

   ```typescript
   // Write test first for a domain component
   it('should display low stock warning when stock is below 10', () => {
     const material = { id: '1', name: 'Dialyzer', stock: 5 };
     render(<MaterialCard material={material} onEdit={jest.fn()} />);
     
     expect(screen.getByText(/low stock/i)).toBeInTheDocument();
   });
   ```

2. **🟢 Green**: Write the minimal code to make the test pass using SHADCN

   ```typescript
   // Implement just enough to pass using SHADCN components
   import { Card } from '#/shared/components/ui/card';
   
   export function MaterialCard({ material, onEdit }) {
     return (
       <Card>
         {material.stock < 10 && <span>Low Stock</span>}
       </Card>
     );
   }
   ```

3. **♻️ Refactor**: Improve the code while keeping tests green

   ```typescript
   // Add TypeScript, better SHADCN composition, variants, etc.
   import { Card, CardContent } from '#/shared/components/ui/card';
   import { Badge } from '#/shared/components/ui/badge';
   
   export function MaterialCard({ material, onEdit }: MaterialCardProps) {
     const isLowStock = material.stock < 10;
     
     return (
       <Card>
         <CardContent>
           {isLowStock && (
             <Badge variant="destructive">Low Stock</Badge>
           )}
         </CardContent>
       </Card>
     );
   }
   ```

### Lean Development Principles

**Work in Small Steps:**

- Implement one feature/behavior at a time
- Make frequent commits with working code
- Get feedback quickly through automated tests

**Simplest Thing That Works:**

- Start with basic functionality, add complexity incrementally
- Use the simplest data structures and patterns first
- Refactor when patterns become clear

**Fail Fast:**

- Let TypeScript catch errors at compile time
- Use tests to catch logic errors immediately  
- Run `npm run build` frequently during development
