# 📦 Features Documentation

Comprehensive guide to all features and components in this project.

## 🎨 UI Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/Button";

// Usage examples
<Button variant="primary" size="md">Click Me</Button>
<Button variant="outline" size="lg">Outline Button</Button>
<Button variant="danger" loading={true}>Loading...</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `loading`: boolean
- `disabled`: boolean

### Card

Container component with optional header, description, and footer.

```tsx
import { Card } from "@/components/ui/Card";

<Card 
  title="Card Title"
  description="Card description"
  footer={<Button>Action</Button>}
  hover={true}
>
  Card content goes here
</Card>
```

### Input & Textarea

Form input components with validation support.

```tsx
import { Input, Textarea } from "@/components/ui/Input";

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={setEmail}
  error={error}
  required
/>

<Textarea
  label="Message"
  rows={6}
  value={message}
  onChange={setMessage}
/>
```

### ThemeToggle

Dark/light mode toggle button.

```tsx
import { ThemeToggle } from "@/components/ui/ThemeToggle";

<ThemeToggle />
```

## 🎣 Custom Hooks

### useLocalStorage

Persist state in browser's localStorage.

```tsx
import { useLocalStorage } from "@/hooks/useLocalStorage";

function MyComponent() {
  const [value, setValue] = useLocalStorage<string>("key", "default");
  
  return (
    <button onClick={() => setValue("new value")}>
      Update
    </button>
  );
}
```

**Features:**
- Automatic JSON serialization/deserialization
- SSR-safe (checks for window object)
- Syncs across tabs/windows
- TypeScript generic support

### useTheme

Manage application theme with system preference detection.

```tsx
import { useTheme } from "@/hooks/useTheme";

function ThemeSelector() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

**Themes:**
- `light`: Light mode
- `dark`: Dark mode
- `system`: Follow system preference

### useMediaQuery

Responsive design helper for media queries.

```tsx
import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from "@/hooks/useMediaQuery";

function ResponsiveComponent() {
  const isMobile = useIsMobile(); // < 768px
  const isTablet = useIsTablet(); // 768px - 1023px
  const isDesktop = useIsDesktop(); // >= 1024px
  const isWideScreen = useMediaQuery("(min-width: 1440px)");
  
  return <div>{isMobile ? "Mobile" : "Desktop"}</div>;
}
```

## 🛠️ Utility Functions

### cn (className merge)

Intelligently merge Tailwind CSS classes.

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  "text-red-500", // This will be merged properly
  className // Props className
)} />
```

### formatDate

Format dates to readable strings.

```tsx
import { formatDate } from "@/lib/utils";

formatDate(new Date()); // "January 1, 2024"
formatDate("2024-01-01", "en-GB"); // Custom locale
```

### formatCurrency

Format numbers as currency.

```tsx
import { formatCurrency } from "@/lib/utils";

formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, "EUR"); // "€1,234.56"
```

### Other Utilities

```tsx
import { 
  truncate, 
  sleep, 
  generateId, 
  deepClone, 
  isEmpty 
} from "@/lib/utils";

truncate("Long text...", 10); // "Long text..."
await sleep(1000); // Wait 1 second
const id = generateId(); // Random unique ID
const clone = deepClone(object); // Deep copy
isEmpty(""); // true
isEmpty([]); // true
isEmpty({}); // true
```

## ✅ Validation Functions

### Email Validation

```tsx
import { isValidEmail } from "@/lib/validations";

isValidEmail("test@example.com"); // true
isValidEmail("invalid"); // false
```

### Password Validation

```tsx
import { isValidPassword } from "@/lib/validations";

// Requires: 8+ chars, uppercase, lowercase, number
isValidPassword("Password123"); // true
isValidPassword("weak"); // false
```

### Form Validation

```tsx
import { validateLoginForm, validateRegisterForm } from "@/lib/validations";

const result = validateLoginForm({
  email: "user@example.com",
  password: "password"
});

if (!result.isValid) {
  console.log(result.errors); // { email: "...", password: "..." }
}
```

**Available validators:**
- `isValidEmail`
- `isValidPassword`
- `isValidUrl`
- `isValidPhoneNumber`
- `isValidCreditCard`
- `isValidUsername`
- `isRequired`
- `isValidLength`

## 🌐 API Services

### API Client

Centralized HTTP client for API requests.

```tsx
import { apiClient } from "@/services/api/client";

// GET request
const users = await apiClient.get<User[]>("/users");

// POST request
const newUser = await apiClient.post<User>("/users", {
  name: "John Doe",
  email: "john@example.com"
});

// With query parameters
const filtered = await apiClient.get<User[]>("/users", {
  params: { role: "admin" }
});
```

**Methods:**
- `get(url, config)`
- `post(url, body, config)`
- `put(url, body, config)`
- `patch(url, body, config)`
- `delete(url, config)`

### User Service

```tsx
import { userService } from "@/services/api/users";

// Get all users
const users = await userService.getUsers();

// Get user by ID
const user = await userService.getUserById("123");

// Create user
const newUser = await userService.createUser({ name: "..." });

// Update user
const updated = await userService.updateUser("123", { name: "..." });

// Delete user
await userService.deleteUser("123");
```

### Auth Service

```tsx
import { authService } from "@/services/auth/auth.service";

// Login
const result = await authService.login({
  email: "user@example.com",
  password: "password"
});

// Register
const result = await authService.register({
  username: "johndoe",
  email: "john@example.com",
  password: "Password123",
  confirmPassword: "Password123"
});

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get current user
const user = await authService.getCurrentUser();
```

## 🗂️ Constants

Pre-defined constants for consistent usage across the app.

```tsx
import { 
  APP_NAME, 
  APP_URL, 
  API_URL,
  NAV_LINKS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  THEMES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from "@/lib/constants";

console.log(APP_NAME); // "Cars Project"
console.log(API_ENDPOINTS.USERS); // "/users"
console.log(STORAGE_KEYS.THEME); // "theme"
```

## 📘 TypeScript Types

All types are centralized in `types/index.ts`:

```tsx
import type {
  User,
  UserRole,
  Product,
  ApiResponse,
  LoginFormData,
  RegisterFormData,
  Theme,
  ButtonProps,
  InputProps,
  CardProps
} from "@/types";
```

## 🎯 Path Aliases

Clean imports using configured path aliases:

```tsx
import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatDate } from "@/lib/utils";
import { userService } from "@/services/api/users";
import type { User } from "@/types";
```

**Available aliases:**
- `@/*` - Root directory
- `@/components/*` - Components
- `@/app/*` - App directory
- `@/lib/*` - Utilities
- `@/hooks/*` - Custom hooks
- `@/types/*` - Type definitions
- `@/services/*` - API services
- `@/styles/*` - Styles

## 🚀 API Routes

### GET /api/hello

Example endpoint demonstrating API routes.

```bash
curl http://localhost:3000/api/hello
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "Hello from Next.js API Routes!",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

### User Endpoints

```bash
# Get all users
GET /api/users

# Get user by ID
GET /api/users/[id]

# Create user
POST /api/users

# Update user
PUT /api/users/[id]

# Delete user
DELETE /api/users/[id]
```

### Product Endpoints

```bash
# Get all products
GET /api/products

# Filter by category
GET /api/products?category=Electric

# Get featured products
GET /api/products?featured=true

# Create product
POST /api/products
```

## 🎨 Theming

### Tailwind Custom Theme

Customized colors, fonts, and spacing in `tailwind.config.ts`:

```tsx
// Primary colors (blue shades)
bg-primary-500
text-primary-600
border-primary-700

// Secondary colors (purple shades)
bg-secondary-500
text-secondary-600

// Dark mode
dark:bg-gray-900
dark:text-white
```

### Custom CSS Classes

Utility classes defined in `styles/globals.css`:

```tsx
<div className="container">...</div>
<div className="glass">...</div>
<h1 className="gradient-text">...</h1>
<input className="focus-ring" />
<div className="animate-fade-in">...</div>
<div className="animate-slide-up">...</div>
```

---

## 💡 Best Practices

1. **Import aliases**: Always use `@/` path aliases
2. **Type safety**: Define types for all data structures
3. **Reusable components**: Use UI components from `/components/ui`
4. **Validation**: Use validation functions before API calls
5. **Error handling**: Always handle errors in try-catch blocks
6. **Dark mode**: Support both light and dark themes
7. **Responsive**: Use media query hooks for responsive design
8. **Clean code**: Follow the established patterns and structure

---

**For more information, see README.md and SETUP.md**

