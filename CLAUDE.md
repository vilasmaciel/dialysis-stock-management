### General rules

- All code, docs and texts must be in english
- Commits must follow conventional commits convention

### Current Stack
- **Build Tool:** Vite
- **Router:** TanStack Router (file-based routing)
- **Data Fetching:** TanStack Query (React Query)
- **UI Library:** React 19.1.0
- **Design System:** Titan React (@audienseco/titan-react)
- **Styling:** SHADCN
- **Testing:** Vitest + React Testing Library + MSW
- **Linting/Formatting:** Biome (automatic)


### Core Architecture Principles

1. **Feature-First Organization**: Views are self-contained with their own components, hooks, domain logic, and contexts
2. **Component Encapsulation**: Each component in its own directory with CSS Modules
3. **Custom Hooks for Logic**: Extract complex logic and API calls to custom hooks
4. **Domain Classes for Complex Logic**: Use TypeScript classes for business logic (e.g., `ReportDefinition`), interfaces for simple data shapes
5. **Import Aliases**: Use `#` aliases for cross-feature imports, relative imports within features

**Example of feature-first structure:**
```typescript
// CreateReport.tsx - Main view component
import { useNavigate } from '@tanstack/react-router';
import { useEventTracker } from '#shared/hooks/useEventTracker'; // Cross-feature
import { useCreateReport } from './hooks/useCreateReport';        // Same feature
import { AudienceSize } from './components/AudienceSize/AudienceSize'; // Same feature
```

## 3. Component Development Rules

### Essential Rules

1. **Directory Structure**: Each component in its own directory with `.module.css` file
2. **TypeScript Props**: Always define props with TypeScript types/interfaces
3. **Logic Extraction**: Extract complex logic to custom hooks
4. **Subcomponents**: Place component-specific children in `components/` subdirectory
5. **Functional Components**: Use functional components with hooks, never class components
6. **Prop Naming**: Use descriptive names and optional props sparingly

### Component Complexity Guidelines

- **Simple components** (like `AudienceSize`): Single responsibility, minimal state
- **Complex components** (like `CreateReport`): Orchestrate multiple subcomponents, use multiple hooks
- **Container components**: Handle data fetching and state management
- **Presentation components**: Focus on rendering and user interactions

**❌ Critical Don'ts:**
- Never put business logic directly in component render functions
- Never use class components - always use functional components with hooks
- Never create components without TypeScript props definitions
- Never skip the CSS Modules file even if initially empty

## 7. Testing Standards

### Test Structure

Tests reside in `tests/` directory mirroring the `src/` structure:
```
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

- **Components**: Rendering, user interactions, conditional states
- **Hooks**: Return values, state updates, side effects
- **Views**: Integration of components and hooks, data display
- **Domain Logic**: Business rules, calculations, transformations

**❌ Critical Don'ts:**
- Never test implementation details like internal state variables
- Never make real API calls in tests - always mock with MSW
- Never use `querySelector` on the container - use accessible queries
- Never skip testing user interactions and error states


## Development Workflow

### TDD Cycle (Red-Green-Refactor)

Follow Test-Driven Development for all components and hooks:

1. **🔴 Red**: Write a failing test that describes the desired behavior
   ```typescript
   // Write test first
   it('should toggle switch when clicked', async () => {
     const handleChange = jest.fn();
     render(<Switch checked={false} onChange={handleChange} />);
     
     await userEvent.click(screen.getByRole('switch'));
     expect(handleChange).toHaveBeenCalledWith(true);
   });
   ```

2. **🟢 Green**: Write the minimal code to make the test pass
   ```typescript
   // Implement just enough to pass
   export function Switch({ checked, onChange }) {
     return <div role="switch" onClick={() => onChange(!checked)} />;
   }
   ```

3. **♻️ Refactor**: Improve the code while keeping tests green
   ```typescript
   // Add TypeScript, styling, accessibility, etc.
   export function Switch({ checked, onChange }: SwitchProps) {
     // Enhanced implementation...
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
